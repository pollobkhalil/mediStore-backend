import { Router } from 'express';


import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';

const router = Router();

/**
 * POST /api/v1/auth/register
 * Public route for user sign-up
 */
router.post(
  '/register',
  validateRequest(AuthValidation.registerSchema),
  AuthController.registerUser
);

export const AuthRoutes = router;