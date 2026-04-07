import bcrypt from 'bcrypt';

import { TRegisterUser } from './auth.interface';
import { prisma } from '../../lib/prisma';

/**
 * Service to handle user registration logic
 * @param payload User data from request
 */
const registerUserIntoDB = async (payload: TRegisterUser) => {
  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const newUser = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
    // Exclude password from the returned object for security
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return newUser;
};

export const AuthService = {
  registerUserIntoDB,
};