import { Request, Response } from 'express';
import { CustomeError } from '../../data/domain/errors/custom.error';
import { ProductsService } from './service/products.service';

export class ProductController {
  constructor(private readonly productService: ProductsService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomeError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getAllProducts = (req: Request, res: Response) => {
    this.productService
      .getAllProducts()
      .then((product) => {
        res.status(200).json(product);
      })
      .catch((err) => this.handleError(err, res));
  };

  getProductsActive = (req: Request, res: Response) => {
    this.productService
      .getProductsActive()
      .then((product) => {
        res.status(200).json(product);
      })
      .catch((err) => this.handleError(err, res));
  };
}
