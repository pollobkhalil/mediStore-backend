import bcrypt from 'bcrypt';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

import { TLoginUser, TRegisterUser } from './auth.interface';
import { prisma } from '../../lib/prisma';

/**
 * Service to register a new user into the database
 * @param payload - User registration data
 * @returns The newly created user object (excluding password)
 */
const registerUserIntoDB = async (payload: TRegisterUser) => {
  // Hash the password before saving to DB
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const newUser = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return newUser;
};

/**
 * Service to authenticate user and generate JWT tokens
 * @param payload - User login credentials
 * @returns Access token and Refresh token
 */
const loginUser = async (payload: TLoginUser) => {
  // 1. Check if user exists
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  // 2. Check if the user is blocked
  if (user.status === 'BLOCKED') {
    throw new Error('This user is blocked!');
  }

  // 3. Verify password
  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordMatched) {
    throw new Error('Invalid password. Please try again.');
  }

  // 4. Create JWT Payload
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  // 5. Generate Access Token (Short-lived)
  const accessToken = jwt.sign(jwtPayload, 'YOUR_ACCESS_SECRET' as Secret, {
    expiresIn: '1h',
  });

  // 6. Generate Refresh Token (Long-lived)
  const refreshToken = jwt.sign(jwtPayload, 'YOUR_REFRESH_SECRET' as Secret, {
    expiresIn: '30d',
  });

  return {
    accessToken,
    refreshToken,
  };
};

/**
 * Service to generate a new access token using a refresh token
 * @param token - The refresh token from cookies
 * @returns A new access token
 */
const refreshToken = async (token: string) => {
  // 1. Verify the provided refresh token
  const decoded = jwt.verify(token, 'YOUR_REFRESH_SECRET' as Secret) as JwtPayload;

  const { email } = decoded;

  // 2. Check if user still exists and is active
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  if (user.status === 'BLOCKED') {
    throw new Error('This user is blocked!');
  }

  // 3. Generate a new Access Token
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, 'YOUR_ACCESS_SECRET' as Secret, {
    expiresIn: '1h',
  });

  return {
    accessToken,
  };
};

export const AuthService = {
  registerUserIntoDB,
  loginUser,
  refreshToken,
};