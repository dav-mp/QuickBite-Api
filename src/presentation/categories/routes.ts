import { Router } from 'express';
import { CategoriesService } from './service/categories.service';
import { CategoryController } from './controller';

export class CategoriesRoutes {
  static get routes(): Router {
    const router = Router();
    const service = new CategoriesService();
    const controller = new CategoryController(service);

    router.post('/getAll', controller.getAllCategories);
    router.post('/getCategoriesActive', controller.getCategoriesActive);

    return router;
  }
}
