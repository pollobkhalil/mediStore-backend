import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import { orderService } from './order.service';
import catchAsync from '../../errors/catchAsync';
import httpStatus from 'http-status';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  // Casting req as any to access user property
  const { id: userId } = (req as any).user; 
  const result = await orderService.createOrderInDB(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order placed successfully!',
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: Response | any, res: Response) => {
  const { id: userId } = (req as any).user;
  const result = await orderService.getMyOrdersFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your order history retrieved successfully',
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const { id: userId, role } = (req as any).user;
  const { id: orderId } = req.params;
  
  // Logic: Admin/Seller can see any order, Customer can only see their own
  const result = await orderService.getSingleOrderFromDB(
    orderId as string, 
    role === 'ADMIN' || role === 'SELLER' ? undefined : userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order details retrieved successfully',
    data: result,
  });
});

// --- New Admin/Seller Specific Controllers ---

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.getAllOrdersFromDB(); // Need to add in service

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All orders retrieved successfully (Admin Access)',
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await orderService.updateOrderStatusInDB(id, status); // Need to add in service

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order status updated successfully',
    data: result,
  });
});

export const orderController = {
  createOrder,
  getMyOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus
};