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

// category.service.ts এর অংশ
const updateCategory = async (id: string, payload: any) => {
  return await prisma.category.update({
    where: { id },
    data: payload,
  });
};

const deleteCategory = async (id: string) => {
  return await prisma.category.delete({
    where: { id },
  });
};





export const categoryService = {
  deleteCategory,
  updateCategory,
  createCategory,
  getAllCategories,
};