import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { TMedicine, TMedicineQuery } from './medicine.interface';

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
const getAllMedicinesFromDB = async (query: TMedicineQuery, sellerId?: string) => {
  const searchTerm = query.searchTerm as string;
  const category = query.category as string;
  const minPrice = query.minPrice as string;
  const maxPrice = query.maxPrice as string;
  
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const andConditions: Prisma.MedicineWhereInput[] = [{ isDeleted: false }];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { brand: { contains: searchTerm, mode: 'insensitive' } },
      ],
    });
  }

  if (category) {
    andConditions.push({
      category: { name: { equals: category, mode: 'insensitive' } },
    });
  }

  if (sellerId) {
    andConditions.push({ sellerId });
  }

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

/**
 * Update medicine details
 * Added sellerId to ensure only the owner can update
 */
const updateMedicineInDB = async (
  id: string, 
  sellerId: string, 
  payload: Partial<TMedicine>
) => {
  // 1. Check if the medicine exists and belongs to the seller
  const isExist = await prisma.medicine.findUnique({
    where: { id, isDeleted: false },
  });

  if (!isExist) {
    throw new Error('Medicine not found!');
  }

  if (isExist.sellerId !== sellerId) {
    throw new Error('You are not authorized to update this medicine!');
  }

  // 2. Perform the update
  const result = await prisma.medicine.update({
    where: { id },
    data: payload,
    include: {
      category: { select: { name: true } },
    },
  });

  return result;
};

/**
 * Soft delete a medicine
 * Ensures ownership before marking as deleted
 */
const deleteMedicineFromDB = async (id: string, sellerId: string) => {
  const isExist = await prisma.medicine.findUnique({
    where: { id, isDeleted: false },
  });

  if (!isExist) {
    throw new Error('Medicine not found!');
  }

  // Ensure only the owner can delete
  if (isExist.sellerId !== sellerId) {
    throw new Error('You are not authorized to delete this medicine!');
  }

  const result = await prisma.medicine.update({
    where: { id },
    data: { isDeleted: true }, // Logic for soft delete
  });

  return result;
};

/**
 * Get medicines belonging to a specific seller
 */
const getMyMedicinesFromDB = async (sellerId: string) => {
  return await prisma.medicine.findMany({
    where: {
      sellerId,
      isDeleted: false,
    },
    include: {
      category: true,
    },
  });
};

export const medicineService = {
  getMyMedicinesFromDB,
  deleteMedicineFromDB,
  updateMedicineInDB,
  createMedicine,
  getAllMedicinesFromDB,
  getSingleMedicineFromDB,
};