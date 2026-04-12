import { prisma } from '../../lib/prisma';

const getAdminDashboardStats = async () => {
    const totalUsers = await prisma.user.count();
    const totalMedicines = await prisma.medicine.count({ where: { isDeleted: false } });
    const totalOrders = await prisma.order.count();
    // Add revenue calculation logic here

    return { totalUsers, totalMedicines, totalOrders, totalRevenue: 0 };
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
    getAdminDashboardStats,
    getAllUsersFromDB,
    updateUserStatusInDB,
    getAllOrdersFromDB
};