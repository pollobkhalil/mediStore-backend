import express from 'express';
import { orderController } from './order.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

//  Create order
router.post(
  '/',
  auth(UserRole.CUSTOMER),
  orderController.createOrder
);

//  View personal orders
router.get(
  '/',
  auth(UserRole.CUSTOMER),
  orderController.getMyOrders
);


router.get(
  '/:id',
  auth(UserRole.CUSTOMER),
  orderController.getSingleOrder
);

export const orderRoutes = router;