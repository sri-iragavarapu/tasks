const auth = require('./controllers/authController');

const makeReq = (body) => ({ body, session: {} });
const makeRes = (done) => ({
  statusCode: 200,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    done({ statusCode: this.statusCode, body: data });
    return this;
  }
});

const run = (method, body) => new Promise((resolve) => {
  auth[method](makeReq(body), makeRes(resolve));
});

(async () => {
  const demoEmployee = await run('login', { email: 'john@levitateit.com', password: 'password123' });
  const demoSupport = await run('login', { email: 'support@levitateit.com', password: 'admin123' });
  const uniqueEmail = 'verify-' + Date.now() + '@example.com';
  const registered = await run('register', { name: 'Verifier Test', email: uniqueEmail, password: 'Verifier@2026', department: 'Engineering' });
  const reLogin = await run('login', { email: uniqueEmail, password: 'Verifier@2026' });

  console.log(JSON.stringify({ demoEmployee, demoSupport, registered, reLogin }, null, 2));
})();
