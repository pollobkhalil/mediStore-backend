import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../errors/catchAsync';
import { medicineService } from './medicine.service';
import { TMedicineQuery } from './medicine.interface';
import sendResponse from '../../utils/sendResponse';

// Add a new medicine
const createMedicine = catchAsync(async (req: Request, res: Response) => {
  // Casting 'req' as 'any' to access 'user' property added by auth middleware
  const user = (req as any).user;
  const sellerId = user.id;

  const result = await medicineService.createMedicine({ ...req.body, sellerId });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Medicine added successfully!',
    data: result,
  });
});

// Get all medicines with Search, Filter & Pagination (The Shop Route)
const getAllMedicines = catchAsync(async (req: Request, res: Response) => {
  const result = await medicineService.getAllMedicinesFromDB(
    req.query as unknown as TMedicineQuery
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Medicines fetched successfully!',
    meta: result.meta,
    data: result.data,
  });
});

// Get a single medicine by ID (Medicine Details Page)
const getSingleMedicine = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await medicineService.getSingleMedicineFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Medicine fetched successfully!',
    data: result,
  });
});

// Update medicine details
const updateMedicine = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const sellerId = (req as any).user.id;

  const result = await medicineService.updateMedicineInDB(
    id as string,
    sellerId as string,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Medicine updated successfully!',
    data: result,
  });
});

// Delete medicine
const deleteMedicine = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const sellerId = (req as any).user.id;

  await medicineService.deleteMedicineFromDB(id as string, sellerId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Medicine deleted successfully!',
    data: null,
  });
});

// Get seller's own inventory
const getMyMedicines = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const sellerId = user.id;

  const result = await medicineService.getMyMedicinesFromDB(sellerId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
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