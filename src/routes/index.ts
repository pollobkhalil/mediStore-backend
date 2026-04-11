import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.route';
import { categoryRoutes } from '../modules/Category/category.route';
import { medicineRoutes } from '../modules/Medicine/medicine.route';
import { userRoutes } from '../modules/User/user.route';


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
    path: '/categories',
    route: categoryRoutes,
  },
  {
    path: '/admin/categories',
    route: categoryRoutes,
  },
  {
    path: '/medicines',
    route: medicineRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;