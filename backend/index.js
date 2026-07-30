const express = require('express');
const cors = require('cors');
const bodyParser = require('express').json;
require('dotenv').config();

const authRoutes = require('./routes/auth');
const leavesRoutes = require('./routes/leaves');
const usersRoutes = require('./routes/users');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser());

app.use('/auth', authRoutes);
app.use('/leaves', leavesRoutes);
app.use('/users', usersRoutes);

app.get('/', (req, res) => {
  res.json({message: 'Employee Leave Management API'});
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
