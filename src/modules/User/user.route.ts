import express from 'express';
import { userController } from './user.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

// GET /api/v1/users/me
router.get(
  '/me',
  auth(UserRole.ADMIN, UserRole.SELLER, UserRole.CUSTOMER),
  userController.getMyProfile
);

// PATCH /api/v1/users/update-me
router.patch(
  '/update-me',
  auth(UserRole.ADMIN, UserRole.SELLER, UserRole.CUSTOMER),
  userController.updateMyProfile
);

export const userRoutes = router;