import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { CartController } from './cart.controller';

const router = express.Router();

// Apply auth middleware to all routes in this router

router.use(auth(UserRole.CUSTOMER));

// Add item to cart
router.post('/', CartController.addToCart);

// Get logged-in user's cart
router.get('/', CartController.getMyCart);

// Remove specific item from cart

router.delete('/:id', CartController.removeItemFromCart);

export const CartRoutes = router;