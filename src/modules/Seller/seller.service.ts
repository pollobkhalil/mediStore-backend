import { prisma } from '../../lib/prisma';

const getSellerDashboardStats = async (sellerId: string) => {
  // Count total medicines for this seller
  const totalMedicines = await prisma.medicine.count({
    where: { sellerId, isDeleted: false },
  });

  // Count total orders involving this seller's products
  const totalOrders = await prisma.order.count({
      where: { 
          orderItems: { some: { medicine: { sellerId } } } 
      }
  });

  return {
    totalMedicines,
    totalOrders,
    totalRevenue: 0, // Logic to be added based on schema
  };
};

const getSellerOrdersFromDB = async (sellerId: string) => {
  // Fetch all orders for this seller's inventory
  return await prisma.order.findMany({
    where: {
      orderItems: { some: { medicine: { sellerId } } }
    },
    include: {
      orderItems: true,
      customer: { select: { name: true, email: true } }
    }
  });
};

export const sellerService = {
  getSellerDashboardStats,
  getSellerOrdersFromDB
};