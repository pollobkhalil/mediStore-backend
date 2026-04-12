import { Request, Response } from 'express';


import { userService } from './user.service';
import catchAsync from '../../errors/catchAsync';
import sendResponse from '../../utils/sendResponse';

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user; // auth middleware 

  const result = await userService.getMyProfileFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const { name, phoneNumber, address, profilePhoto } = req.body;

  
  const result = await userService.updateMyProfileInDB(id, {
    name,
    phoneNumber,
    address,
    profilePhoto,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

export const userController = {
  getMyProfile,
  updateMyProfile,
};