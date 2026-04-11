import { Request, Response } from 'express';
import { authService } from './auth.service';

const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.registerUser(req.body);
    const { refreshToken, accessToken, user } = result;

    // Cookie configuration deployment friendly
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
      maxAge: 365 * 24 * 60 * 60 * 1000, 
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      data: { accessToken, user }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed!',
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(req.body);
    const { refreshToken, accessToken, user } = result;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'User logged in successfully!',
      data: { accessToken, user },
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || 'Login failed!',
    });
  }
};

export const authController = { registerUser, loginUser };