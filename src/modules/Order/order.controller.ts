import { Request, Response } from 'express';

import sendResponse from '../../utils/sendResponse';
import { orderService } from './order.service';
import catchAsync from '../../errors/catchAsync';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user; // auth middleware theke asha user id
  const result = await orderService.createOrderInDB(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Order placed successfully',
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const result = await orderService.getMyOrdersFromDB(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My orders retrieved successfully',
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const { id: orderId } = req.params;
  
  const result = await orderService.getSingleOrderFromDB(orderId as string, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order details retrieved successfully',
    data: result,
  });
});



export const orderController = {
  createOrder,
  getMyOrders,
  getSingleOrder
};