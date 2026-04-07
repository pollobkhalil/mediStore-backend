import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user (Customer or Seller)
 * @access  Public
 */
router.post(
  '/register',
  validateRequest(AuthValidation.registerSchema),
  AuthController.registerUser
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post(
  '/login',
  validateRequest(AuthValidation.loginSchema),
  AuthController.loginUser
);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Generate a new access token using refresh token
 * @access  Public (Requires Refresh Token in Cookies)
 */
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenSchema),
  AuthController.refreshToken
);

export const AuthRoutes = router;