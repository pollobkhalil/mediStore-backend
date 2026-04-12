import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../errors/catchAsync';
import { medicineService } from './medicine.service';
import { TMedicineQuery } from './medicine.interface';
import sendResponse from '../../utils/sendResponse';



// Add a new medicine
const createMedicine = catchAsync(async (req: Request, res: Response) => {
  const sellerId = req.user.id; 
  const result = await medicineService.createMedicine({ ...req.body, sellerId });

  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Medicine added successfully!',
    data: result,
  });
});

// Get all medicines with Search, Filter & Pagination
const getAllMedicines = catchAsync(async (req: Request, res: Response) => {
  
  const result = await medicineService.getAllMedicinesFromDB(
    req.query as TMedicineQuery 
  );
  
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Medicines fetched successfully!',
    meta: result.meta,
    data: result.data,
  });
});

// Get a single medicine by ID
const getSingleMedicine = catchAsync(async (req: Request, res: Response) => {
  // Use 'as string' to tell TypeScript this is a single ID string
  const id = req.params.id as string; 
  
  const result = await medicineService.getSingleMedicineFromDB(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Medicine fetched successfully!',
    data: result,
  });
});


// Update medicine details
const updateMedicine = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await medicineService.updateMedicineInDB(id as string, req.body);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Medicine updated successfully!',
    data: result,
  });
});



const deleteMedicine = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const sellerId = req.user.id;

  await medicineService.deleteMedicineFromDB(id as string, sellerId);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Medicine deleted successfully!',
    data: null,
  });
});


const getMyMedicines = catchAsync(async (req: Request, res: Response) => {
  const { id: sellerId } = req.user; 

  const result = await medicineService.getMyMedicinesFromDB(sellerId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Seller inventory retrieved successfully',
    data: result,
  });
});



export const medicineController = {
  getMyMedicines,
  deleteMedicine,
  updateMedicine,
  createMedicine,
  getAllMedicines,
  getSingleMedicine,
};