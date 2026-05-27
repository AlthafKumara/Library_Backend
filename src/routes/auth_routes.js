import { Router } from 'express';

const router = Router();

// Register
router.post('/register', (req, res) => {
  res.status(501).json({ success: false, message: 'Register endpoint - coming soon' });
});

// Login
router.post('/login', (req, res) => {
  res.status(501).json({ success: false, message: 'Login endpoint - coming soon' });
});

// Logout
router.post('/logout', (req, res) => {
  res.status(501).json({ success: false, message: 'Logout endpoint - coming soon' });
});

export default router;