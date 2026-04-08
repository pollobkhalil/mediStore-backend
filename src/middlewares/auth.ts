import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import { prisma } from '../lib/prisma'; // আপনার প্রিজমা ক্লায়েন্ট পাথ

const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      // auth token 
      if (!token) {
        throw new Error('You are not authorized!');
      }

      // token verify
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string
      ) as JwtPayload;

      const { role, email } = decoded;

      //  user database 
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error('User not found!');
      }

      // role permission check
      if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new Error('You have no permission to access this route!');
      }

      // Request object user
      req.user = decoded as JwtPayload;
      next();
    } catch (error: any) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: error.message || 'Unauthorized access!',
      });
    }
  };
};

export default auth;