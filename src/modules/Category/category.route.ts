import express from 'express';
import { categoryController } from './category.controller';
import auth from '../../middlewares/auth';


const router = express.Router();

// Only Admin can create categories
router.post(
  '/', 
  auth('ADMIN'), 
  categoryController.createCategory
);

// Public can view categories
router.get('/', categoryController.getAllCategories);

export const categoryRoutes = router;