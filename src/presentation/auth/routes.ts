import { Router } from 'express';
import { AuthRestaurantController } from './controller';
import { AuthRestaurantService } from './service/restaurant.service';
import { AuthController } from './controller';
import { AuthService } from './service/auth.service';
import { AuthServiceProvider } from '../../data/supabase/AuthServiceProvider';

/**
 * Aquí podrías separar en dos Routers distintos:
 *  - /restaurant -> AuthRestaurantRoutes
 *  - /user -> AuthUserRoutes
 *
 * O unificarlos. Aquí te muestro un ejemplo con sub-rutas:
 */
export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    // --- Restaurant ---
    const restaurantService = new AuthRestaurantService();
    const restaurantController = new AuthRestaurantController(restaurantService);

    router.post('/restaurant/login', restaurantController.loginRestaurant);
    router.post('/restaurant/logout', restaurantController.logoutRestaurant);

    // --- User ---
    const provider = new AuthServiceProvider();
    const authService = new AuthService(provider);
    const userController = new AuthController(authService);

    router.post('/user/register', userController.registerUser);
    router.post('/user/login', userController.loginUser);

    return router;
  }
}
