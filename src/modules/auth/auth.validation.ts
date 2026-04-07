import { z } from 'zod';

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['CUSTOMER', 'SELLER']).optional().default('CUSTOMER'),
  }),
});

export const AuthValidation = {
  registerSchema,
};