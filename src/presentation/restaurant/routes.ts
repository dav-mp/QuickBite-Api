import { Router } from 'express';
import { RestaurantController } from './controller';
import { RestaurantService } from './service/restaurant.service';

export class RestaurantRoutes {
  static get routes(): Router {
    const router = Router();
    const service = new RestaurantService();
    const controller = new RestaurantController(service);

    router.post('/getAll', controller.getAllRestaurant);
    router.post('/getRestaurantsOpen', controller.getRestaurantsOpen);
    router.post('/getAllRestaurantsAnyShift', controller.getAllRestaurantsAnyShift);

    return router;
  }
}
