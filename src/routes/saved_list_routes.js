import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { formValidate } from '../validators/form_validate.js';
import {
  createSavedListSchema,
  savedListByIdSchema,
  updateSavedListSchema,
} from '../models/schema/saved_list_schema.js';
import {
  createSavedList,
  getMySavedLists,
  updateSavedList,
  deleteSavedList,
} from '../controllers/saved_list_controller.js';

const router = Router();

// ==========================================
// POST /saved-lists
// Create saved list
// ==========================================
router.post('/', authenticate, formValidate(createSavedListSchema), createSavedList);

// ==========================================
// GET /saved-lists/me
// Get logged-in user's saved lists
// ==========================================
router.get('/me', authenticate, getMySavedLists);

// ==========================================
// PUT /saved-lists/:id
// Update saved list name
// ==========================================
router.put('/:id', authenticate, formValidate(updateSavedListSchema), updateSavedList);

// ==========================================
// DELETE /saved-lists/:id
// Delete saved list
// ==========================================
router.delete('/:id', authenticate, formValidate(savedListByIdSchema), deleteSavedList);

export default router;
