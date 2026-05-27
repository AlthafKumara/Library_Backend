import { Router } from 'express';

const router = Router();

// GET all borrows
router.get('/', (req, res) => {
  res.status(501).json({ success: false, message: 'Get borrows endpoint - coming soon' });
});

// GET single borrow record
router.get('/:id', (req, res) => {
  res.status(501).json({ success: false, message: 'Get borrow endpoint - coming soon' });
});

// POST borrow a book
router.post('/', (req, res) => {
  res.status(501).json({ success: false, message: 'Borrow book endpoint - coming soon' });
});

// PUT return a book
router.put('/:id/return', (req, res) => {
  res.status(501).json({ success: false, message: 'Return book endpoint - coming soon' });
});

export default router;
