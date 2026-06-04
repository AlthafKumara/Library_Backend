import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { formValidate } from '../validators/auth_validate.js';
import {
  addCategorySchema,
  getCategoryByIdSchema,
  updateCategorySchema,
  deleteCategorySchema,
} from '../models/schema/book_schema.js';
import {
  addCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/book_controller.js';

const router = Router();

// ==========================================
// POST /categories
// Add a new book category (protected)
// ==========================================
router.post('/', authenticate, formValidate(addCategorySchema), addCategory);

// ==========================================
// GET /categories
// Get all book categories (public)
// ==========================================
router.get('/', getAllCategories);

// ==========================================
// GET /categories/:id
// Get a single book category by UUID (public)
// ==========================================
router.get('/:id', formValidate(getCategoryByIdSchema), getCategoryById);

// ==========================================
// PUT /categories/:id
// Update a book category by ID (protected)
// ==========================================
router.put('/:id', authenticate, formValidate(updateCategorySchema), updateCategory);

// ==========================================
// DELETE /categories/:id
// Delete a book category by ID (protected)
// ==========================================
router.delete('/:id', authenticate, formValidate(deleteCategorySchema), deleteCategory);

export default router;

