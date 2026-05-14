import { Request, Response } from 'express';


import httpStatus from 'http-status';
import { ReviewService } from './review.service';
import catchAsync from '../../errors/catchAsync';
import sendResponse from '../../utils/sendResponse';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = (req as any).user; 
  const result = await ReviewService.createReviewInDB(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review submitted successfully!',
    data: result,
  });
});

const getMedicineReviews = catchAsync(async (req: Request, res: Response) => {
  const { medicineId } = req.params;
  const result = await ReviewService.getMedicineReviewsFromDB(medicineId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews fetched successfully!',
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getMedicineReviews,
};