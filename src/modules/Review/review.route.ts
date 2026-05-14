import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { ReviewController } from './review.controller';

const router = express.Router();


router.post(
  '/',
  auth(UserRole.CUSTOMER),
  ReviewController.createReview
);


router.get(
  '/:medicineId',
  ReviewController.getMedicineReviews
);

export const ReviewRoutes = router;