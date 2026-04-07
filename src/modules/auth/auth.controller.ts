import { Request, Response } from 'express';
import { AuthService } from './auth.service';

/**
 * Controller to handle user registration
 */
const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.registerUserIntoDB(req.body);

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong',
      error: error,
    });
  }
};

export const AuthController = {
  registerUser,
};