import { Router } from 'express';

import { AuthRoutes } from './auth/routes';
import { KitRoutes } from './kit/routes';
import { OrderRoutes } from './order/routes';
import { ProductRoutes } from './product/routes';
import { CategoriesRoutes } from './categories/routes';
import { RestaurantRoutes } from './restaurant/routes';

/**
 * Aquí unificamos TODAS las rutas.
 */
export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Auth
    // /api/auth/...
    router.use('/api/auth', AuthRoutes.routes);

    // Kit
    // /api/kit/...
    router.use('/api/kit', KitRoutes.routes);

    // Order
    // /api/order/...
    router.use('/api/order', OrderRoutes.routes);

    // Product
    // /api/product/...
    router.use('/api/product', ProductRoutes.routes);

    // Category
    // /api/category/...
    router.use('/api/category', CategoriesRoutes.routes);

    // Restaurant
    // /api/restaurant/...
    router.use('/api/restaurant', RestaurantRoutes.routes);

    return router;
  }
}
