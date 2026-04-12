import { prisma } from '../../lib/prisma';

const getAdminDashboardStatsFromDB = async () => {
  // Total Revenue
  const totalRevenue = await prisma.order.aggregate({
    _sum: {
      totalAmount: true,
    },
  });

  // Total Orders
  const totalOrders = await prisma.order.count();

  // Total Customer
  const totalCustomers = await prisma.user.count({
    where: { role: 'CUSTOMER' },
  });

  // Total Seller 
  const totalSellers = await prisma.user.count({
    where: { role: 'SELLER' },
  });

  // Total Medicine
  const totalMedicines = await prisma.medicine.count();

  return {
    revenue: totalRevenue._sum.totalAmount || 0,
    totalOrders,
    totalCustomers,
    totalSellers,
    totalMedicines,
  };
};


// Fetch all users with specific fields
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
    });
};

// Update user status (Active/Blocked)
const updateUserStatusInDB = async (id: string, status: string) => {
    return await prisma.user.update({
        where: { id },
        data: { status: status as any }, // casting to any to match prisma enum
    });
};


const getAllOrdersFromDB = async () => {
    return await prisma.order.findMany({
        include: {
            orderItems: {
                include: {
                    medicine: {
                        select: { name: true, price: true }
                    }
                }
            },
            user: {
                select: { name: true, email: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const adminService =
{
    getAdminDashboardStatsFromDB,
    getAllUsersFromDB,
    updateUserStatusInDB,
    getAllOrdersFromDB
};