import { prisma } from '../../lib/prisma';
import { OrderStatus } from '@prisma/client';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { CartService } from '../Cart/cart.service'; 

/**
 * Create a new order with stock validation and automatic cart clearing
 */
const createOrderInDB = async (userId: string, payload: { shippingAddress: string, contactNumber: string }) => {
  const { shippingAddress, contactNumber } = payload;

  return await prisma.$transaction(async (tx) => {
    
    
    const cart = await tx.cart.findUnique({
      where: { customerId: userId },
      include: {
        cartItems: {
          include: { medicine: true } 
        }
      }
    });

   
    if (!cart || cart.cartItems.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "Your cart is empty!");
    }

    let calculatedTotalAmount = 0;
    const orderItemsToCreate = [];

   
    for (const cartItem of cart.cartItems) {
      const medicine = cartItem.medicine;

    
      if (medicine.stockQuantity < cartItem.quantity) {
        throw new AppError(
          httpStatus.BAD_REQUEST, 
          `Insufficient stock for ${medicine.name}. Available: ${medicine.stockQuantity}`
        );
      }

   
      calculatedTotalAmount += medicine.price * cartItem.quantity;

     
      await tx.medicine.update({
        where: { id: medicine.id },
        data: {
          stockQuantity: { decrement: cartItem.quantity },
        },
      });

      
      orderItemsToCreate.push({
        medicineId: cartItem.medicineId,
        quantity: cartItem.quantity,
        price: medicine.price, 
      });
    }

  
    const order = await tx.order.create({
      data: {
        customerId: userId,
        totalAmount: calculatedTotalAmount,
        shippingAddress,
        contactNumber,
        status: OrderStatus.PENDING,
        orderItems: {
          create: orderItemsToCreate,
        },
      },
      include: {
        orderItems: true,
      },
    });

    
    await CartService.clearCartFromDB(userId, tx);

    return order;
  });
};

/**
 * Fetch all orders for a specific customer
 */
const getMyOrdersFromDB = async (userId: string) => {
  return await prisma.order.findMany({
    where: { customerId: userId },
    include: {
      orderItems: {
        include: { 
          medicine: {
            select: { name: true, image: true, brand: true, price: true }
          } 
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Fetch a single order detail for the owner
 */
const getSingleOrderFromDB = async (orderId: string, userId: string) => {
  const result = await prisma.order.findUnique({
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

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found or access denied');
  }

  return result;
};


// Fetch all orders (Admin/Seller Access)
const getAllOrdersFromDB = async () => {
  return await prisma.order.findMany({
    include: {
      customer: {
        select: {
          name: true,
          email: true,
        },
      },
      orderItems: {
        include: {
          medicine: {
            select: { name: true, brand: true }
          }
        }
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

// Update Order Status (Admin/Seller Access)
const updateOrderStatusInDB = async (orderId: string, status: OrderStatus) => {
  const isExist = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found!');
  }

  const result = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      orderItems: true,
    },
  });

  return result;
};

export const orderService = {
  createOrderInDB,
  getMyOrdersFromDB,
  getSingleOrderFromDB, 
  updateOrderStatusInDB,
  getAllOrdersFromDB
};