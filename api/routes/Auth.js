const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign(
      { email: adminEmail },
      process.env.JWT_SECRET || 'supersecretjwtkey2026',
      { expiresIn: '8h' }
    );
    return res.status(200).json({ token });
  }

  return res.status(401).json({ message: 'Invalid email or password' });
});

module.exports = router;
