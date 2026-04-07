import { z } from 'zod';

/**
 * Zod schema for User Registration
 */
const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format').min(1, 'Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['ADMIN', 'SELLER', 'CUSTOMER']).optional(),
  }),
});

/**
 * Zod schema for User Login
 */
const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format').min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

/**
 * Zod schema for Refresh Token (usually comes from cookies)
 */
const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

export const AuthValidation = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
};