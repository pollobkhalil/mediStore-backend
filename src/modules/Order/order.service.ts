import { prisma } from '../../lib/prisma';
import { OrderStatus } from '@prisma/client';

const createOrderInDB = async (userId: string, payload: any) => {
  const { items, shippingAddress, contactNumber, totalAmount } = payload;

  // Transaction 
  return await prisma.$transaction(async (tx) => {
   
    const order = await tx.order.create({
      data: {
        customerId: userId,
        totalAmount,
        shippingAddress,
        contactNumber,
        status: OrderStatus.PENDING,
        // ২. রিলেটেড অর্ডার আইটেমগুলো ক্রিয়েট করা
        orderItems: {
          create: items.map((item: any) => ({
            medicineId: item.medicineId,
            quantity: item.quantity,
            price: item.price, // capture current price
          })),
        },
      },
    });

    // Stock check
    for (const item of items) {
      const medicine = await tx.medicine.findUnique({
        where: { id: item.medicineId },
      });

      if (!medicine || medicine.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for ${medicine?.name || 'medicine'}`);
      }

      await tx.medicine.update({
        where: { id: item.medicineId },
        data: {
          stockQuantity: { decrement: item.quantity },
        },
      });
    }

    return order;
  });
};

// Customer order view
const getMyOrdersFromDB = async (userId: string) => {
  return await prisma.order.findMany({
    where: { customerId: userId },
    include: {
      orderItems: {
        include: { medicine: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};


const getSingleOrderFromDB = async (orderId: string, userId: string) => {
  return await prisma.order.findUnique({
    where: {
      id: orderId,
      customerId: userId, 
    },
    include: {
      orderItems: {
        include: {
          medicine: {
            select: { name: true, image: true, brand: true } 
          }
        }
      }
    }
  });
};

export const orderService = {
  createOrderInDB,
  getMyOrdersFromDB,
  getSingleOrderFromDB
};