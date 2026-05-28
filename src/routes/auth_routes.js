import { Router } from 'express';
import { formValidate } from "../validators/auth_validate.js";
import {loginSchema, registerSchema} from "../models/auth_schema.js";
import { login, logout, registerAdmin, registerUser } from '../controllers/auth_controller.js';

const router = Router();

// Register
router.post('/registerUser', formValidate(registerSchema), registerUser);

router.post('/registerAdmin', formValidate(registerSchema), registerAdmin);

// Login
router.post('/login', formValidate(loginSchema), login);

// Logout
router.post('/logout', logout);

export default router;