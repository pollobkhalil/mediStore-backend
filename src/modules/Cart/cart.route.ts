import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { CartController } from './cart.controller';

const router = express.Router();

// only customer
router.post('/', auth(UserRole.CUSTOMER), CartController.addToCart);
router.get('/', auth(UserRole.CUSTOMER), CartController.getMyCart);
router.delete('/:id', auth(UserRole.CUSTOMER), CartController.removeItemFromCart);

export const CartRoutes = router;