import express from 'express';
import { orderController } from './order.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

// --- Customer Routes ---

// Create order (Only Customers)
router.post(
  '/',
  auth(UserRole.CUSTOMER),
  orderController.createOrder
);

// View personal orders (Customer viewing their own history)
router.get(
  '/my-orders',
  auth(UserRole.CUSTOMER),
  orderController.getMyOrders
);

// --- Admin/Seller Routes ---

// View ALL orders (For Admin/Seller to see everyone's orders)
router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.SELLER),
  orderController.getAllOrders 
);

// Update order status (For Admin/Seller to mark as SHIPPED/DELIVERED)
router.patch(
  '/:id',
  auth(UserRole.SELLER),
  orderController.updateOrderStatus 
);



// Get single order details
router.get(
  '/:id',
  auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SELLER),
  orderController.getSingleOrder
);

export const orderRoutes = router;