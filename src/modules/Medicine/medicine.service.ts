import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { TMedicine } from './medicine.interface';

/**
 * Create a new medicine entry
 */
const createMedicine = async (payload: TMedicine) => {
  const result = await prisma.medicine.create({
    data: payload,
    include: { category: true },
  });
  return result;
};

/**
 * Fetch medicines with search, filter, and pagination
 */
const getAllMedicinesFromDB = async (query: any) => {
  // Explicitly cast query parameters to handle TS errors
  const searchTerm = query.searchTerm as string;
  const category = query.category as string;
  const minPrice = query.minPrice as string;
  const maxPrice = query.maxPrice as string;
  
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // Initial filter for non-deleted records
  const andConditions: Prisma.MedicineWhereInput[] = [{ isDeleted: false }];

  // Partial match search for name or brand
  if (searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { brand: { contains: searchTerm, mode: 'insensitive' } },
      ],
    });
  }

  // Exact match filter for category name
  if (category) {
    andConditions.push({
      category: { name: { equals: category, mode: 'insensitive' } },
    });
  }

  // Range filter for price
  if (minPrice || maxPrice) {
    andConditions.push({
      price: {
        gte: parseFloat(minPrice) || 0,
        lte: parseFloat(maxPrice) || Infinity,
      },
    });
  }

  const whereConditions: Prisma.MedicineWhereInput = { AND: andConditions };

  const result = await prisma.medicine.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { name: true } },
      seller: { select: { name: true } },
    },
  });

  const total = await prisma.medicine.count({ where: whereConditions });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

/**
 * Fetch details of a single medicine
 */
const getSingleMedicineFromDB = async (id: string) => {
  const result = await prisma.medicine.findUnique({
    where: { 
      id, 
      isDeleted: false 
    },
    include: {
      category: { select: { name: true } },
      seller: { select: { name: true } },
    },
  });

  if (!result) {
    throw new Error('Medicine not found!');
  }

  return result;
};

export const medicineService = {
  createMedicine,
  getAllMedicinesFromDB,
  getSingleMedicineFromDB,
};