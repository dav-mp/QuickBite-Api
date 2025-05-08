import { Router } from 'express';
import { OrderController } from './controller';
import { OrderService } from './service/order.service';

export class OrderRoutes {
  static get routes(): Router {
    const router = Router();
    const service = new OrderService();
    const controller = new OrderController(service);

    router.post('/getAllOrders', controller.getAllOrders);
    router.post('/user/createOrder', controller.createOrder);
    router.post('/user/getAllOrdersByCustomerId', controller.getAllOrdersByCustomerId);
    router.post('/restaurant/geAllOrders', controller.geAllOrdersRestaurant);
    router.post('/restaurant/getActiveOrders', controller.getActiveOrders);
    router.post('/restaurant/changeStatusOrder', controller.changeStatusOrder);

    return router;
  }
}
