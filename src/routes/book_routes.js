import { Router } from 'express';

const router = Router();

// GET all books
router.get('/', (req, res) => {
  res.status(501).json({ success: false, message: 'Get books endpoint - coming soon' });
});

// GET single book
router.get('/:id', (req, res) => {
  res.status(501).json({ success: false, message: 'Get book endpoint - coming soon' });
});

// POST create book
router.post('/', (req, res) => {
  res.status(501).json({ success: false, message: 'Create book endpoint - coming soon' });
});

// PUT update book
router.put('/:id', (req, res) => {
  res.status(501).json({ success: false, message: 'Update book endpoint - coming soon' });
});

// DELETE book
router.delete('/:id', (req, res) => {
  res.status(501).json({ success: false, message: 'Delete book endpoint - coming soon' });
});

export default router;
