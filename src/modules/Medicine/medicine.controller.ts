import { Request, Response } from 'express';
import { medicineService } from './medicine.service';

const createMedicine = async (req: Request, res: Response) => {
  try {
    // Get seller info from decoded token
    const sellerId = req.user.id; 
    const result = await medicineService.createMedicine({ ...req.body, sellerId });

    res.status(201).json({
      success: true,
      message: 'Medicine added successfully!',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllMedicines = async (req: Request, res: Response) => {
  try {
    const result = await medicineService.getAllMedicines();
    res.status(200).json({
      success: true,
      message: 'Medicines fetched successfully!',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error!' });
  }
};

export const medicineController = {
  createMedicine,
  getAllMedicines,
};