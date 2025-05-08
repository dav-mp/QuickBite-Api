import { Router } from 'express';
import { KitController } from './controller';
import { KitService } from './service/kit.service';

export class KitRoutes {
  static get routes(): Router {
    const router = Router();
    const service = new KitService();
    const controller = new KitController(service);

    router.post('/getAllKits', controller.getAllKits);
    router.post('/getAllKitsWithProducts', controller.getAllKitsWithProductsId);

    return router;
  }
}
