import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { formValidate } from '../validators/form_validate.js';
import { uploadPhoto, uploadCover } from '../middlewares/upload_middleware.js';
import {
  addBookSchema,
  updateBookSchema,
  getBookByIdSchema,
} from '../models/schema/book_schema.js';
import {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  uploadCoverBook,
} from '../controllers/book_controller.js';

const router = Router();

// ==========================================
// POST /books
// Add a new book (protected)
// ==========================================
router.post('/', authenticate, formValidate(addBookSchema), addBook);

// ==========================================
// GET /books
// Get all books with category (public)
// ==========================================
router.get('/', getAllBooks);

// ==========================================
// GET /books/:id
// Get single book by UUID (public)
// ==========================================
router.get('/:id', formValidate(getBookByIdSchema), getBookById);

// ==========================================
// PUT /books/:id
// Update a book by UUID (protected)
// ==========================================
router.put('/:id', authenticate, formValidate(updateBookSchema), updateBook);

// ==========================================
// DELETE /books/:id
// Delete a book by UUID (protected)
// ==========================================
router.delete('/:id', authenticate, formValidate(getBookByIdSchema), deleteBook);

// ==========================================
// POST /books/:id/cover
// Upload cover image for a book (protected)
// ==========================================
router.post('/:id/cover', authenticate, uploadCover, uploadCoverBook);

export default router;
