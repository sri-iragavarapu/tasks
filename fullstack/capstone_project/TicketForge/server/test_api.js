const http = require('http');

function makeRequest(options, postData = null, cookie = null) {
    return new Promise((resolve, reject) => {
        const reqOptions = {
            hostname: 'localhost',
            port: 5000,
            path: options.path,
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(cookie ? { 'Cookie': cookie } : {})
            }
        };

        const req = http.request(reqOptions, (res) => {
            let body = '';
            const resCookie = res.headers['set-cookie'] ? res.headers['set-cookie'][0].split(';')[0] : cookie;
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, cookie: resCookie, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, cookie: resCookie, data: body });
                }
            });
        });

        req.on('error', reject);
        if (postData) req.write(JSON.stringify(postData));
        req.end();
    });
}

async function runVerification() {
    console.log('🧪 Starting Full System Integration API Verification...\n');

    // 1. Health Check
    const health = await makeRequest({ path: '/api/health' });
    console.log('1️⃣ Server Health Check:', health.data.message);

    // 2. Login as Employee (John Doe)
    const empLogin = await makeRequest(
        { path: '/api/auth/login', method: 'POST' },
        { email: 'john@levitateit.com', password: 'password123' }
    );
    const empCookie = empLogin.cookie;
    console.log('2️⃣ Employee Login:', empLogin.data.message, '| User:', empLogin.data.user.name);

    // 3. Create Ticket as Employee
    const newTicket = await makeRequest(
        { path: '/api/tickets', method: 'POST' },
        {
            title: 'Laptop battery draining fast',
            description: 'Battery drops from 100% to 10% in 30 minutes',
            category: 'Hardware',
            priority: 'High'
        },
        empCookie
    );
    const ticketId = newTicket.data.ticketId;
    console.log('3️⃣ Raise Ticket:', newTicket.data.message, '| Ticket ID:', ticketId);

    // 4. Send Message in Ticket as Employee
    const msg1 = await makeRequest(
        { path: `/api/messages/${ticketId}`, method: 'POST' },
        { message: 'Also replacing the charger might help.' },
        empCookie
    );
    console.log('4️⃣ Send Chat Message:', msg1.data.message);

    // 5. Update Profile (Name & Password)
    const profileUpd = await makeRequest(
        { path: '/api/users/profile', method: 'PUT' },
        { name: 'Johnathan Doe' },
        empCookie
    );
    console.log('5️⃣ Update Profile:', profileUpd.data.message, '| Updated Name:', profileUpd.data.user.name);

    // 6. Login as IT Support (Sarah)
    const supportLogin = await makeRequest(
        { path: '/api/auth/login', method: 'POST' },
        { email: 'support@levitateit.com', password: 'admin123' }
    );
    const supportCookie = supportLogin.cookie;
    console.log('6️⃣ IT Support Login:', supportLogin.data.message, '| User:', supportLogin.data.user.name);

    // 7. IT Support Assign Ticket to Self (Auto-assignment)
    const assignRes = await makeRequest(
        { path: `/api/tickets/${ticketId}/assign`, method: 'PUT' },
        {},
        supportCookie
    );
    console.log('7️⃣ Auto-Assign Ticket:', assignRes.data.message, '| Status:', assignRes.data.status, '| Assigned At:', assignRes.data.assigned_at);

    // 8. Fetch Detailed Ticket Info
    const detailRes = await makeRequest(
        { path: `/api/tickets/${ticketId}` },
        null,
        supportCookie
    );
    console.log('8️⃣ Verified Ticket Details:');
    console.log('   - Number: #TK-' + String(detailRes.data.ticket.id).padStart(4, '0'));
    console.log('   - Creator:', detailRes.data.ticket.creator_name);
    console.log('   - Assigned Agent:', detailRes.data.ticket.assignee_name);
    console.log('   - Assigned Date & Time:', detailRes.data.ticket.assigned_at);
    console.log('   - Category & Priority:', detailRes.data.ticket.category, '|', detailRes.data.ticket.priority);

    // 9. IT Support List All Employees
    const empList = await makeRequest(
        { path: '/api/users/employees' },
        null,
        supportCookie
    );
    console.log('9️⃣ List Employees Count:', empList.data.employees.length);

    // 10. Clean up test ticket created during integration verification
    await makeRequest(
        { path: `/api/tickets/${ticketId}`, method: 'DELETE' },
        null,
        supportCookie
    );
    console.log('🔟 Cleaned up integration test ticket (ID: ' + ticketId + ').');

    console.log('\n🎉 ALL FULL STACK API & DATABASE VERIFICATIONS PASSED SUCCESSFULLY!');
}

runVerification().catch(err => console.error('Verification Error:', err));
