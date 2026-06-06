import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { formValidate } from '../validators/form_validate.js';
import {
  createCommunitySchema,
  getCommunityListSchema,
  getCommunityByIdSchema,
  updateCommunitySchema,
  deleteCommunitySchema,
} from '../models/schema/community_schema.js';
import {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
} from '../controllers/community_controller.js';

const router = Router();

// All community routes require authentication
router.use(authenticate);

// ==========================================
// POST /community
// Create a message
// ==========================================
router.post('/', formValidate(createCommunitySchema), createMessage);

// ==========================================
// GET /community
// Read all top-level messages + replies_count
// ==========================================
router.get('/', formValidate(getCommunityListSchema), getAllMessages);

// ==========================================
// GET /community/:id
// Read detail message + replies
// ==========================================
router.get('/:id', formValidate(getCommunityByIdSchema), getMessageById);

// ==========================================
// PUT /community/:id
// Update message (owner only)
// ==========================================
router.put('/:id', formValidate(updateCommunitySchema), updateMessage);

// ==========================================
// DELETE /community/:id
// Delete message (owner only)
// ==========================================
router.delete('/:id', formValidate(deleteCommunitySchema), deleteMessage);

export default router;
