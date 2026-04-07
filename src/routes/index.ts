import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';

const router = Router();

/**
 * Define your module routes here.
 * As you create more modules (Medicine, Order), add them to this array.
 */
const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;