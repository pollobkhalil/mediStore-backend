import { UserRole } from '@prisma/client';

export type TRegisterUser = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
};