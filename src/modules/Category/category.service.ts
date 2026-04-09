import { prisma } from '../../lib/prisma';


const createCategory = async (payload: any) => {
  // Create a new medicine category
  const result = await prisma.category.create({
    data: payload,
  });
  return result;
};

const getAllCategories = async () => {
  // Fetch all categories for public view
  const result = await prisma.category.findMany({
    include: {
      _count: {
        select: { medicines: true },
      },
    },
  });
  return result;
};

export const categoryService = {
  createCategory,
  getAllCategories,
};