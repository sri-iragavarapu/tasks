const bcrypt = require('bcrypt');
const { run } = require('./db');

async function init() {
  // create tables
  await run(`
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'employee',
      department_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(department_id) REFERENCES departments(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS leaves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      type TEXT,
      reason TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      reviewed_by INTEGER,
      reviewed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(reviewed_by) REFERENCES users(id)
    )
  `);

  // seed department and admin user
  await run(`INSERT OR IGNORE INTO departments (id, name) VALUES (1, 'HR')`);
  await run(`INSERT OR IGNORE INTO departments (id, name) VALUES (2, 'Engineering')`);

  const adminPassword = await bcrypt.hash('Password123!', 10);
  await run(`INSERT OR IGNORE INTO users (id, name, email, password, role, department_id) VALUES (1, 'Admin', 'admin@example.com', ?, 'admin', 1)`, [adminPassword]);

  console.log('Database initialized. Admin user: admin@example.com / Password123!');
  process.exit(0);
}

init().catch(err => {
  console.error(err);
  process.exit(1);
});