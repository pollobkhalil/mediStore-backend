import { prisma } from '../../lib/prisma';
import { TMedicine } from './medicine.interface';

const createMedicine = async (payload: TMedicine) => {
  const result = await prisma.medicine.create({
    data: payload,
  });
  return result;
};

const getAllMedicines = async () => {
  return await prisma.medicine.findMany({
    where: { isDeleted: false },
    include: { category: true, seller: { select: { name: true, email: true } } },
  });
};

export const medicineService = {
  createMedicine,
  getAllMedicines,
};