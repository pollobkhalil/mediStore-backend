import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.route';
import { categoryRoutes } from '../modules/Category/category.route';
import { medicineRoutes } from '../modules/Medicine/medicine.route';
import { userRoutes } from '../modules/User/user.route';
import { sellerRoutes } from '../modules/Seller/seller.route';
import { adminRoutes } from '../modules/Admin/admin.route';
import { orderRoutes } from '../modules/Order/order.route';
import { CartRoutes } from '../modules/Cart/cart.route';
import { ReviewRoutes } from '../modules/Review/review.route';


const router = Router();


const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/admin',
    route: userRoutes,
  },
  {
    path: '/seller',
    route: userRoutes,
  },
  {
    path: '/seller',
    route: sellerRoutes,
  },
  {
    path: '/admin',
    route: adminRoutes,
  },
  {
    path: '/categories',
    route: categoryRoutes,
  },
  {
    path: '/admin/categories',
    route: categoryRoutes,
  },
  {
    path: '/shop',
    route: medicineRoutes,
  },
  {
    path: '/orders',
    route: orderRoutes,
  },

  {
    path: '/cart',
    route: CartRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;