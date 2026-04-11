import { prisma } from '../../lib/prisma';

// নিজের প্রোফাইল দেখা
const getMyProfileFromDB = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

// নিজের প্রোফাইল আপডেট করা
const updateMyProfileInDB = async (id: string, payload: any) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  return result;
};

export const userService = {
  getMyProfileFromDB,
  updateMyProfileInDB,
};