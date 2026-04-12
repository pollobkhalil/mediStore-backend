import express from 'express';
import { adminController } from './admin.controller';
import { categoryController } from '../Category/category.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

//  Dashboard Stats
router.get('/', auth(UserRole.ADMIN), adminController.getDashboardStats);

//  Manage Users
router.get('/users', auth(UserRole.ADMIN), adminController.getAllUsers);
router.patch('/users/:id/status', auth(UserRole.ADMIN), adminController.updateUserStatus);

//  Manage All Orders
router.get('/orders', auth(UserRole.ADMIN), adminController.getAllOrders);

//  Manage Categories 
router.post('/categories', auth(UserRole.ADMIN), categoryController.createCategory);
router.get('/categories', categoryController.getAllCategories); // Public or Admin

export const adminRoutes = router;