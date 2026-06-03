import { Router } from 'express';
import { formValidate } from "../validators/auth_validate.js";
import {loginSchema, registerSchema} from "../models/schema/auth_schema.js";
import { login, logout, refreshToken, register,} from '../controllers/auth_controller.js';

const router = Router();

// Register
router.post('/register', formValidate(registerSchema), register);

// Login
router.post('/login', formValidate(loginSchema), login);

// Logout
router.post('/logout', logout);

// Refresh Token 
router.post("/refresh-token", refreshToken);

export default router;