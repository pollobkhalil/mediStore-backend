import { User } from '@prisma/client';
import { prisma } from '../../lib/prisma';

// নিজের প্রোফাইল ডেটা নিয়ে আসা
const getMyProfileFromDB = async (id: string) => {
  return await prisma.user.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      address: true,
      profilePhoto: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
};

// নিজের প্রোফাইল আপডেট করা
const updateMyProfileInDB = async (id: string, payload: Partial<User>) => {
  return await prisma.user.update({
    where: {
      id,
      isDeleted: false,
    },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      address: true,
      profilePhoto: true,
    },
  });
};

export const userService = {
  getMyProfileFromDB,
  updateMyProfileInDB,
};