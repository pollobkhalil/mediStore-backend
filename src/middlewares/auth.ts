import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import { prisma } from '../lib/prisma';

const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      // Check if auth header exists and starts with Bearer
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('You are not authorized!');
      }

      // Extract the actual token string (remove "Bearer ")
      const token = authHeader.split(' ')[1];

      // Token verify
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string
      ) as JwtPayload;

      const { role, email } = decoded;

      // Check user in database
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error('User not found!');
      }

      // Check if user is blocked or deleted
      if (user.status === 'BLOCKED' || user.isDeleted) {
        throw new Error('This user is not active!');
      }

      // Role permission check
      if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new Error('You have no permission to access this route!');
      }

      // Attach user to request object
      req.user = decoded;
      next();
    } catch (error: any) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: error.name === 'JsonWebTokenError' ? 'Invalid token' : error.message,
      });
    }
  };
};

export default auth;