import { Request, Response } from 'express';
import { categoryService } from './category.service';
import catchAsync from '../../errors/catchAsync';


// ১. ক্যাটাগরি তৈরি করা
const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.createCategory(req.body);
  
  res.status(201).json({
    success: true,
    message: 'Category created successfully!',
    data: result,
  });
});

// ২. সব ক্যাটাগরি দেখা
const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getAllCategories();
  
  res.status(200).json({
    success: true,
    message: 'Categories fetched successfully!',
    data: result,
  });
});

// ৩. ক্যাটাগরি আপডেট করা
const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await categoryService.updateCategory(id as string, req.body);
  
  res.status(200).json({
    success: true,
    message: 'Category updated successfully!',
    data: result,
  });
});

// Category Delete
const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await categoryService.deleteCategory(id as string);
  
  res.status(200).json({
    success: true,
    message: 'Category deleted successfully!',
    data: result,
  });
});

export const categoryController = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};