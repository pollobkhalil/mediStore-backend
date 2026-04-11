import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';

// type safe token 
const createToken = (
  jwtPayload: { id: string; email: string; role: string },
  secret: Secret,
  expiresIn: string
) => {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign(jwtPayload, secret, options);
};

const registerUser = async (payload: any) => {
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

  const jwtPayload = { id: newUser.id, email: newUser.email, role: newUser.role };

  const accessToken = createToken(
    jwtPayload,
    process.env.JWT_ACCESS_SECRET as Secret,
    '1d'
  );

  const refreshToken = createToken(
    jwtPayload,
    process.env.JWT_REFRESH_SECRET as Secret,
    '365d'
  );

  const { password, ...userData } = newUser;

  return { accessToken, refreshToken, user: userData };
};

const loginUser = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user || user.isDeleted) {
    throw new Error('User not found!');
  }

  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatched) {
    throw new Error('Invalid password!');
  }

  const jwtPayload = { id: user.id, email: user.email, role: user.role };

  const accessToken = createToken(
    jwtPayload,
    process.env.JWT_ACCESS_SECRET as Secret,
    '1d'
  );

  const refreshToken = createToken(
    jwtPayload,
    process.env.JWT_REFRESH_SECRET as Secret,
    '365d'
  );

  const { password: userPassword, ...userData } = user;

  return { accessToken, refreshToken, user: userData };
};

export const authService = { registerUser, loginUser };