import { prisma } from '../../lib/prisma';
import { TCartItemRequest } from './cart.interface';

/**
 * Add an item to the cart. 
 * If the cart doesn't exist, it creates one.
 * If the item already exists in the cart, it updates the quantity.
 */
const addToCart = async (userId: string, payload: TCartItemRequest) => {
  const { medicineId, quantity } = payload;

  //  Check if the user already has a cart
  let cart = await prisma.cart.findUnique({
    where: { customerId: userId },
  });

  // If no cart exists, create a new one for the user
  if (!cart) {
    cart = await prisma.cart.create({
      data: { customerId: userId },
    });
  }

  //  Check if this specific medicine is already in the cart
  const existingCartItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      medicineId,
    },
  });

  if (existingCartItem) {
    // If item exists, update the quantity by adding the new amount
    return await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity: existingCartItem.quantity + quantity },
    });
  }

  // 5. If item doesn't exist, create a new cart item
  return await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      medicineId,
      quantity,
    },
  });
};

/**
 * Retrieve the user's cart including all items and medicine details
 */
const getMyCart = async (userId: string) => {
  return await prisma.cart.findUnique({
    where: { customerId: userId },
    include: {
      cartItems: {
        include: {
          medicine: true, // Fetch medicine details (name, price, image, etc.)
        },
      },
    },
  });
};

/**
 * Remove a specific item from the cart using its ID
 */
const removeItemFromCart = async (itemId: string) => {
  // 1. First, check if the cart item exists
  const isExist = await prisma.cartItem.findUnique({
    where: { id: itemId },
  });

  if (!isExist) {
    throw new Error('Cart item not found or already removed!');
  }

  // 2. If exists, then delete
  return await prisma.cartItem.delete({
    where: { id: itemId },
  });
};

/**
 * Delete all items from the user's cart
 */
const clearCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { customerId: userId },
  });

  if (cart) {
    return await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }
};

export const CartService = {
  addToCart,
  getMyCart,
  removeItemFromCart,
  clearCart,
};