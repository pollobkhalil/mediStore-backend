import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

/**
 * Middleware to validate request data against a Zod schema
 */
const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        cookies: req.cookies,
      });
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default validateRequest;