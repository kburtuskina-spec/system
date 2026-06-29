const express = require('express');
const db = require('../db');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Simple login (no JWT) - returns user info if login/password match and sets session
router.post('/', async (req, res) => {
  try {
    const { login, password } = req.body;
    if (!login || !password) return res.status(400).json({ error: 'login and password required' });
   const result = await db.query(
  'SELECT id, full_name, role, login, department, password FROM users WHERE login=$1',
  [login]
);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password || '');
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const safe = {
    id: user.id,
    full_name: user.full_name,
    login: user.login,
    department: user.department,
    role: user.role
};
    // сохраняем пользователя в сессии
req.session.user = safe;

res.json(safe);
  } catch (err) {
    const handleDbError = require('../utils/handleDbError');
    return handleDbError(res, err);
  }
});

router.get('/me', async (req, res) => {
  try {
   if (!req.session || !req.session.user)
    return res.status(401).json({ error: 'Unauthorized' });

res.json(req.session.user);
  } catch (err) {
    const handleDbError = require('../utils/handleDbError');
    return handleDbError(res, err);
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

// expose a simple health check for session
router.get('/ping', (req, res) =>
    res.json({ ok: !!(req.session && req.session.user) }));

module.exports = router;
