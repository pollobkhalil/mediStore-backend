import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createReviewInDB = async (userId: string, payload: { medicineId: string; rating: number; comment?: string }) => {
  const { medicineId, rating, comment } = payload;

  // check has medicine buy a customer
  const hasPurchased = await prisma.order.findFirst({
    where: {
      customerId: userId,
      status: 'DELIVERED',
      orderItems: {
        some: {
          medicineId: medicineId,
        },
      },
    },
  });

  if (!hasPurchased) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only review medicines that you have purchased and received."
    );
  }

  // check  already exist review  
  const existingReview = await prisma.review.findFirst({
    where: {
      customerId: userId,
      medicineId: medicineId,
    },
  });

  if (existingReview) {
    throw new AppError(httpStatus.BAD_REQUEST, "You have already reviewed this medicine.");
  }

  // create reveiw
  const result = await prisma.review.create({
    data: {
      customerId: userId,
      medicineId,
      rating,
      comment,
    },
  });

  return result;
};

const getMedicineReviewsFromDB = async (medicineId: string) => {
  return await prisma.review.findMany({
    where: { medicineId },
    include: {
      customer: {
        select: { name: true, image: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const ReviewService = {
  createReviewInDB,
  getMedicineReviewsFromDB
};