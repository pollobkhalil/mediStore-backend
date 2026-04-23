import { OrderStatus } from '@prisma/client';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

/**
 * Get statistics for the seller dashboard
 */
const getSellerDashboardStats = async (sellerId: string) => {
  // 1. Count total medicines owned by this seller that are not deleted
  const totalMedicines = await prisma.medicine.count({
    where: { 
      sellerId, 
      isDeleted: false 
    },
  });

  // 2. Count total unique orders that contain at least one product from this seller
  const totalOrders = await prisma.order.count({
    where: { 
      orderItems: { 
        some: { 
          medicine: { sellerId } 
        } 
      } 
    }
  });

  // 3. Calculate total revenue from delivered orders for this seller's products
  const revenueData = await prisma.orderItem.aggregate({
    where: {
      medicine: {
        sellerId: sellerId,
      },
      order: {
        status: 'DELIVERED', // Only count revenue from completed deliveries
      },
    },
    _sum: {
      price: true, // Summing up the price column in OrderItem table
    },
  });

  return {
    totalMedicines,
    totalOrders,
    totalRevenue: revenueData._sum.price || 0,
  };
};

/**
 * Fetch all orders associated with this seller's inventory
 */
const getSellerOrdersFromDB = async (sellerId: string) => {
  return await prisma.order.findMany({
    where: {
      orderItems: { 
        some: { 
          medicine: { sellerId } 
        } 
      }
    },
    include: {
      // Filter order items to only show products belonging to this seller
      orderItems: {
        where: {
          medicine: { sellerId }
        },
        include: {
          medicine: true
        }
      },
      // Include basic customer information
      customer: { 
        select: { 
          name: true, 
          email: true 
        } 
      }
    },
    orderBy: {
      createdAt: 'desc' // Show newest orders first
    }
  });
};



const updateSellerOrderStatusInDB = async (sellerId: string, orderId: string, status: OrderStatus) => {
  //  Check if the order exists and contains products from this specific seller
  const orderWithSellerItems = await prisma.order.findFirst({
    where: {
      id: orderId,
      orderItems: {
        some: {
          medicine: {
            sellerId: sellerId,
          },
        },
      },
    },
  });

if (!orderWithSellerItems) {
    throw new AppError(
      403, 
      "You are not authorized to update this order or the order doesn't exist"
    );
  }

  //  Update the status
  const result = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      orderItems: {
        where: { medicine: { sellerId } },
        include: { medicine: true }
      }
    }
  });

  return result;
};

export const sellerService = {
  getSellerDashboardStats,
  getSellerOrdersFromDB,
  updateSellerOrderStatusInDB
};