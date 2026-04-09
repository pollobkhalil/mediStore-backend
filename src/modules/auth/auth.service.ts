import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';


const registerUser = async (payload: any) => {
  // Prevent duplicate accounts
  const isUserExist = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (isUserExist) {
    throw new Error('Email already registered. Please login.');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const newUser = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
  });

  // Remove password from response for security
  const { password, ...userData } = newUser;
  return userData;
};

const loginUser = async (payload: any) => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new Error('User not found!');
  }

  // Validate password
  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordMatched) {
    throw new Error('Invalid password!');
  }

  // Generate session token
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(
    jwtPayload,
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: '1d' }
  );

  const { password: userPassword, ...userData } = user;

  return {
    accessToken,
    user: userData,
  };
};

export const authService = {
  registerUser,
  loginUser,
};