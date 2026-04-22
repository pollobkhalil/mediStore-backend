import { prisma } from '../../lib/prisma';
import { TCartItemRequest } from './cart.interface';

/**
 * Add an item to the cart with stock validation.
 */
const addToCart = async (userId: string, payload: TCartItemRequest) => {
  const { medicineId, quantity } = payload;

  // 1. Check if the medicine exists and has enough stock
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
  });

  if (!medicine) {
    throw new Error('Medicine not found!');
  }

  if (medicine.stockQuantity < quantity) {
    throw new Error(`Insufficient stock. Only ${medicine.stockQuantity} items available.`);
  }

  // 2. Ensure user has a cart
  let cart = await prisma.cart.findUnique({
    where: { customerId: userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { customerId: userId },
    });
  }

  // 3. Check if the item already exists in the cart
  const existingCartItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      medicineId,
    },
  });

  if (existingCartItem) {
    // Check if new total quantity exceeds stock
    const newQuantity = existingCartItem.quantity + quantity;
    if (medicine.stockQuantity < newQuantity) {
      throw new Error('Total quantity in cart exceeds available stock!');
    }

    return await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity: newQuantity },
    });
  }

  // 4. Create a new cart item
  return await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      medicineId,
      quantity,
    },
  });
};

/**
 * Get user's cart items with medicine details
 */
const getMyCartFromDB = async (userId: string) => {
  return await prisma.cart.findUnique({
    where: { customerId: userId },
    include: {
      cartItems: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
              brand: true,
              stockQuantity: true,
            },
          },
        },
      },
    },
  });
};

/**
 * Remove an item from cart with ownership check
 */
const removeItemFromCart = async (userId: string, itemId: string) => {
  const isExist = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { customerId: userId },
    },
  });

  if (!isExist) {
    throw new Error('Item not found in your cart!');
  }

  return await prisma.cartItem.delete({
    where: { id: itemId },
  });
};

/**
 * Clear cart items (Supports Prisma transactions for Order processing)
 */
const clearCartFromDB = async (userId: string, tx?: any) => {
  const db = tx || prisma;

  const cart = await db.cart.findUnique({
    where: { customerId: userId },
  });

  if (cart) {
    return await db.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }
};

export const CartService = {
  addToCart,
  getMyCartFromDB,
  removeItemFromCart,
  clearCartFromDB,
};