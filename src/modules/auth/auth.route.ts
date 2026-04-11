import express from 'express';
import { authController } from './auth.controller';

const router = express.Router();

// Public routes for authentication
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);

export const authRoutes = router;