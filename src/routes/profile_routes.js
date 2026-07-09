import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { formValidate } from '../validators/form_validate.js';
import { completeProfileSchema, getProfileByIdSchema } from '../models/schema/profile_schema.js';
import { completeProfile, getProfileById, getProfileLogin, uploadPhotoProfile } from '../controllers/profile_controller.js';
import { uploadPhoto } from '../middlewares/upload_middleware.js';

const router = Router();

// ==========================================
// PUT /profile/complete
// Complete the authenticated user's profile (protected)
// ==========================================
router.put('/complete-profile', authenticate, formValidate(completeProfileSchema), completeProfile);

// ==========================================
// POST /profile/photo
// Upload photo profile for logged-in user (protected)
// ==========================================
router.post('/photo', authenticate, uploadPhoto, uploadPhotoProfile);

// ==========================================
// GET /profile/:id
// Get any profile by user ID (public)
// ==========================================
router.get('/:id', formValidate(getProfileByIdSchema), getProfileById);

// ==========================================
// GET /profile/
// Get Login User
// ==========================================
router.get("/", authenticate, getProfileLogin);

export default router;
