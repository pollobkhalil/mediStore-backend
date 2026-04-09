import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.route';
import { categoryRoutes } from '../modules/Category/category.route';
import { medicineRoutes } from '../modules/Medicine/medicine.route';


const router = Router();


const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/categories',
    route: categoryRoutes,
  },
   {
    path: '/medicines',
    route: medicineRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;