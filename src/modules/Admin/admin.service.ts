import { prisma } from '../../lib/prisma';

/**
 * Get comprehensive statistics for the Admin Dashboard
 */
const getAdminDashboardStatsFromDB = async () => {
  // Total Revenue: Only count delivered orders to reflect actual earnings
  const totalRevenue = await prisma.order.aggregate({
    where: {
      status: 'DELIVERED', 
    },
    _sum: {
      totalAmount: true,
    },
  });

  //  Total Orders (Global count)
  const totalOrders = await prisma.order.count();

  //  Total Customers
  const totalCustomers = await prisma.user.count({
    where: { role: 'CUSTOMER', isDeleted: false },
  });

  //  Total Sellers 
  const totalSellers = await prisma.user.count({
    where: { role: 'SELLER', isDeleted: false },
  });

  //  Total Medicine (Excluding deleted products)
  const totalMedicines = await prisma.medicine.count({
    where: { isDeleted: false }
  });

  return {
    revenue: totalRevenue._sum.totalAmount || 0,
    totalOrders,
    totalCustomers,
    totalSellers,
    totalMedicines,
  };
};


const getAllUsersFromDB = async () => {
  return await prisma.user.findMany({
    where: {
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

/**
 * Update user status (Active/Blocked)
 */
const updateUserStatusInDB = async (id: string, status: string) => {
  return await prisma.user.update({
    where: { id },
    data: { 
      status: status as any // Use 'as any' if status is passed as a string from frontend
    },
  });
};

/**
 * Fetch all platform orders for Admin overview
 */
const getAllOrdersFromDB = async () => {
  return await prisma.order.findMany({
    include: {
      orderItems: {
        include: {
          medicine: {
            select: { 
              name: true, 
              price: true,
              sellerId: true 
            }
          }
        }
      },
      user: {
        select: { 
          name: true, 
          email: true 
        }
      }
    },
    orderBy: { 
      createdAt: 'desc' 
    }
  });
};

export const adminService = {
  getAdminDashboardStatsFromDB,
  getAllUsersFromDB,
  updateUserStatusInDB,
  getAllOrdersFromDB
};