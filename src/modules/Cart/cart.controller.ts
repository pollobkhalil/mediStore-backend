import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import { CartService } from './cart.service';
import catchAsync from '../../errors/catchAsync';
import httpStatus from 'http-status'; // http-status ইমপোর্ট করে নিন

const addToCart = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user; 
  // Service-এর নতুন addToCart কল করা হচ্ছে
  const result = await CartService.addToCart(user.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK, // ২০০ এর বদলে httpStatus.OK
    success: true,
    message: 'Item added to cart successfully',
    data: result,
  });
});

const getMyCart = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  // Service-এর ফাংশন নামের সাথে মিলিয়ে getMyCartFromDB লিখুন
  const result = await CartService.getMyCartFromDB(user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cart retrieved successfully',
    data: result,
  });
});

const removeItemFromCart = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params; // এটি আসলে cartItemId
  
  // Security-র জন্য user.id পাস করা হচ্ছে
  await CartService.removeItemFromCart(user.id, id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
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