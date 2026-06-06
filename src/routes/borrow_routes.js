import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { requireAdmin } from '../middlewares/require_admin.js';
import { formValidate } from '../validators/form_validate.js';
import {
  createBorrowSchema,
  getBorrowByIdSchema,
  updateBorrowStatusSchema,
} from '../models/schema/borrow_schema.js';
import {
  createBorrow,
  getMyBorrows,
  getBorrowById,
  getAllBorrows,
  updateBorrowStatus,
} from '../controllers/borrow_controller.js';

const router = Router();

// ==========================================
// POST /borrows
// Create borrow request
// ==========================================
router.post('/', authenticate, formValidate(createBorrowSchema), createBorrow);

// ==========================================
// GET /borrows/me
// Get logged-in user's borrows
// ==========================================
router.get('/me', authenticate, getMyBorrows);

// ==========================================
// GET /borrows/:id
// Get single borrow detail (QR scan)
// ==========================================
router.get('/:id', authenticate, formValidate(getBorrowByIdSchema), getBorrowById);

// ==========================================
// GET /borrows
// Get all borrow requests (admin)
// ==========================================
router.get('/', authenticate, requireAdmin, getAllBorrows);

// ==========================================
// PUT /borrows/:id/status
// Update borrow status (admin)
// ==========================================
router.put('/:id/status', authenticate, requireAdmin, formValidate(updateBorrowStatusSchema), updateBorrowStatus);

export default router;
