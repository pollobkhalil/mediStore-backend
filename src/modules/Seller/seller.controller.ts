import { Request, Response } from 'express';

import sendResponse from '../../utils/sendResponse';
import { sellerService } from './seller.service';
import catchAsync from '../../errors/catchAsync';

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const { id: sellerId } = req.user; // Get ID from auth token
  const result = await sellerService.getSellerDashboardStats(sellerId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Dashboard stats retrieved successfully',
    data: result,
  });
});

const getSellerOrders = catchAsync(async (req: Request, res: Response) => {
  const { id: sellerId } = req.user; // Get ID from auth token
  const result = await sellerService.getSellerOrdersFromDB(sellerId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Seller orders retrieved successfully',
    data: result,
  });
});

export const sellerController = {
  getDashboardStats,
  getSellerOrders
};