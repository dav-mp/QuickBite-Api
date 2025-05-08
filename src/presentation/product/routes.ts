import { Router } from 'express';
import { ProductsService } from './service/products.service';
import { ProductController } from './controller';

export class ProductRoutes {
  static get routes(): Router {
    const router = Router();
    const service = new ProductsService();
    const controller = new ProductController(service);

    router.post('/getAll', controller.getAllProducts);
    router.post('/getProductsActive', controller.getProductsActive);

    return router;
  }
}
