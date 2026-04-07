import { UserRole } from "../../../generated/prisma/enums";


export type TRegisterUser = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
};

// Add this part
export type TLoginUser = {
  email: string;
  password: string;
};