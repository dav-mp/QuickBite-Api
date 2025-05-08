import { Request, Response } from 'express';
import { CustomeError } from '../../data/domain/errors/custom.error';
import { CategoriesService } from './service/categories.service';

export class CategoryController {
  constructor(private readonly categoriesService: CategoriesService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomeError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getAllCategories = (req: Request, res: Response) => {
    this.categoriesService
      .getAllCategories()
      .then((category) => {
        res.status(200).json(category);
      })
      .catch((err) => this.handleError(err, res));
  };

  getCategoriesActive = (req: Request, res: Response) => {
    this.categoriesService
      .getCategoriesActive()
      .then((category) => {
        res.status(200).json(category);
      })
      .catch((err) => this.handleError(err, res));
  };
}
