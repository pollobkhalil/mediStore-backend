import express from 'express';
import { sellerController } from './seller.controller';
import { medicineController } from '../Medicine/medicine.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

// Route: Get dashboard overview
router.get('/dashboard', auth(UserRole.SELLER), sellerController.getDashboardStats);

// Route: Get seller-specific inventory
router.get('/medicines', auth(UserRole.SELLER), medicineController.getMyMedicines);

// Route: Get all orders for this seller
router.get('/orders', auth(UserRole.SELLER), sellerController.getSellerOrders);

export const sellerRoutes = router;