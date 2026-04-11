import { Request, Response } from 'express';
import catchAsync from '../../errors/catchAsync';
import { userService } from './user.service';


const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user; 

  const result = await userService.getMyProfileFromDB(id);

  res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully!',
    data: result,
  });
});

// Profiel update
const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const updateData = req.body;

  // Security check
  const dataToUpdate = {
    name: updateData.name,
    
  };

  const result = await userService.updateMyProfileInDB(id, dataToUpdate);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully!',
    data: result,
  });
});

export const userController = {
  getMyProfile,
  updateMyProfile,
};