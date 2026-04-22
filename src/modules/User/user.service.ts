import { prisma } from '../../lib/prisma';

// Keep profile logic here as it applies to all users (Admin, Seller, Customer)
const updateMyProfile = async (userId: string, payload: any) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      address: true,
      profilePhoto: true,
      status: true,
    },
  });
  return result;
};


const getMyProfileFromDB = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId, isDeleted: false },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      address: true,
      profilePhoto: true,
      status: true,
    },
  });
};

export const userService = {
  updateMyProfile,
  getMyProfileFromDB, 
}