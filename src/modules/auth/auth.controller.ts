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

/**
 * Controller to handle user login
 */
const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.loginUser(req.body);

    // Set refresh token in cookie for security
    res.cookie('refreshToken', result.refreshToken, {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: 'User logged in successfully!',
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid credentials',
    });
  }
};

/**
 * Controller to handle refresh token
 */
const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    const result = await AuthService.refreshToken(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Access token retrieved successfully!',
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }
};

export const AuthController = {
  registerUser,
  loginUser,
  refreshToken,
};