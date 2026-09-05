const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, '../ticketforge.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error connecting to SQLite database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database at:', dbPath);
    }
});

// Initialize Tables and Seed Required Base Accounts
function initDatabase() {
    db.serialize(() => {
        // Enable Foreign Key Constraints
        db.run('PRAGMA foreign_keys = ON;');

        // 1. Users Table
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT CHECK(role IN ('Employee', 'IT_Support', 'Administrator')) NOT NULL DEFAULT 'Employee',
                department TEXT DEFAULT 'General',
                is_active INTEGER NOT NULL DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. Tickets Table
        db.run(`
            CREATE TABLE IF NOT EXISTS tickets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                category TEXT NOT NULL,
                priority TEXT CHECK(priority IN ('Low', 'Medium', 'High', 'Critical')) NOT NULL DEFAULT 'Medium',
                status TEXT CHECK(status IN ('Open', 'In_Progress', 'Resolved', 'Closed')) NOT NULL DEFAULT 'Open',
                created_by INTEGER NOT NULL,
                assigned_to INTEGER DEFAULT NULL,
                assigned_at DATETIME DEFAULT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
            )
        `);

        // 3. Messages Table (Chat)
        db.run(`
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ticket_id INTEGER NOT NULL,
                sender_id INTEGER NOT NULL,
                message TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
                FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Base accounts only (1 Admin, 1 IT Support, 1 Employee)
        const defaultAccounts = [
            {
                name: 'System Admin',
                email: 'admin@levitateit.com',
                password: bcrypt.hashSync('Admin@2026', 10),
                role: 'Administrator',
                department: 'IT Administration'
            },
            {
                name: 'Sarah Connor',
                email: 'support@levitateit.com',
                password: bcrypt.hashSync('admin123', 10),
                role: 'IT_Support',
                department: 'IT Helpdesk'
            },
            {
                name: 'John Doe',
                email: 'john@levitateit.com',
                password: bcrypt.hashSync('password123', 10),
                role: 'Employee',
                department: 'Engineering'
            }
        ];

        // Seed default accounts ONLY if they do not already exist in the database (Checked by email)
        const seedDefaultAccounts = () => {
            defaultAccounts.forEach((acc) => {
                // Check if user already exists by email before inserting
                db.get(`SELECT id FROM users WHERE email = ?`, [acc.email], (err, row) => {
                    if (err) {
                        console.error(`Error checking existing account for ${acc.email}:`, err.message);
                        return;
                    }

                    // Insert ONLY if the user does not exist in the database
                    if (!row) {
                        db.run(
                            `INSERT INTO users (name, email, password, role, department, is_active) VALUES (?, ?, ?, ?, ?, 1)`,
                            [acc.name, acc.email, acc.password, acc.role, acc.department],
                            function (insertErr) {
                                if (insertErr) {
                                    console.error(`Error inserting default account ${acc.email}:`, insertErr.message);
                                } else {
                                    console.log(`✅ Default account created: ${acc.name} (${acc.email}) [Role: ${acc.role}]`);
                                }
                            }
                        );
                    }
                });
            });
        };

        // Table migration check (if schema needs updates)
        db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
            if (row && row.sql && (!row.sql.includes('Administrator') || !row.sql.includes('is_active'))) {
                console.log('🔄 Migrating users table for Administrator role and is_active column...');
                db.serialize(() => {
                    db.run('PRAGMA foreign_keys = OFF;');
                    db.run(`
                        CREATE TABLE users_new (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            name TEXT NOT NULL,
                            email TEXT UNIQUE NOT NULL,
                            password TEXT NOT NULL,
                            role TEXT CHECK(role IN ('Employee', 'IT_Support', 'Administrator')) NOT NULL DEFAULT 'Employee',
                            department TEXT DEFAULT 'General',
                            is_active INTEGER NOT NULL DEFAULT 1,
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                        )
                    `);
                    const hasIsActive = row.sql.includes('is_active');
                    if (hasIsActive) {
                        db.run(`INSERT INTO users_new (id, name, email, password, role, department, is_active, created_at) SELECT id, name, email, password, role, department, is_active, created_at FROM users;`);
                    } else {
                        db.run(`INSERT INTO users_new (id, name, email, password, role, department, is_active, created_at) SELECT id, name, email, password, role, department, 1, created_at FROM users;`);
                    }
                    db.run(`DROP TABLE users;`);
                    db.run(`ALTER TABLE users_new RENAME TO users;`);
                    db.run('PRAGMA foreign_keys = ON;', () => {
                        console.log('✅ Users table migrated successfully.');
                        seedDefaultAccounts();
                    });
                });
            } else {
                seedDefaultAccounts();
            }
        });
    });
}

initDatabase();

module.exports = db;
