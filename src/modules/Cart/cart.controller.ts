import { Request, Response } from 'express';

import sendResponse from '../../utils/sendResponse';
import { CartService } from './cart.service';
import catchAsync from '../../errors/catchAsync';

const addToCart = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user; // Auth middleware থেকে পাওয়া ইউজার
  const result = await CartService.addToCart(user.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Item added to cart successfully',
    data: result,
  });
});

const getMyCart = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await CartService.getMyCart(user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Cart retrieved successfully',
    data: result,
  });
});

const removeItemFromCart = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await CartService.removeItemFromCart(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Item removed from cart successfully',
    data: null,
  });
});

export const CartController = {
  addToCart,
  getMyCart,
  removeItemFromCart,
};