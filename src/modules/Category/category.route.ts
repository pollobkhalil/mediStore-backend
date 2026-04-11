import express from 'express';
import { categoryController } from './category.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

//  Public Route
router.get('/', categoryController.getAllCategories);

// crete category only Admin 
router.post(
  '/', 
  auth('ADMIN'), 
  categoryController.createCategory
);

//  Edit/Update 
router.patch(
  '/:id', 
  auth('ADMIN'), 
  categoryController.updateCategory
);

// Delete R
router.delete(
  '/:id', 
  auth('ADMIN'), 
  categoryController.deleteCategory
);

export const categoryRoutes = router;