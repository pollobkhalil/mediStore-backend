import express from 'express';
import { medicineController } from './medicine.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// Only Sellers and Admins can add medicines
router.post('/', auth('SELLER', 'ADMIN'), medicineController.createMedicine);

// Everyone can view medicines
router.get('/', medicineController.getAllMedicines);
router.patch('/:id', auth('SELLER', 'ADMIN'), medicineController.updateMedicine);

export const medicineRoutes = router;