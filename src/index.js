require('dotenv').config();
const dashboardRouter = require('./routes/dashboard');
const usersRouter = require('./routes/users');
const express = require('express');
const cors = require('cors');
const requestsRouter = require('./routes/requests');
const materialsRouter = require('./routes/materials');
const objectsRouter = require('./routes/objects');
const authRouter = require('./routes/auth');
const session = require('express-session');
const reportsRouter = require('./routes/reports');

const app = express();
app.use(cors());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use('/api/dashboard', dashboardRouter);
app.use('/api/requests', requestsRouter);
app.use('/api/materials', materialsRouter);
app.use('/api/objects', objectsRouter);
app.use('/login', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/reports', reportsRouter);

// Serve static frontend
app.use(express.static('public'));
// API root
app.get('/api', (req, res) => res.send('Uchet zayavok API'));
// Serve frontend index
app.get('/', (req, res) => res.sendFile(require('path').resolve('public/index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
