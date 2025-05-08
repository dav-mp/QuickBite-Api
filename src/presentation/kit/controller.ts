import { Request, Response } from 'express';
import { CustomeError } from '../../data/domain/errors/custom.error';
import { KitService } from './service/kit.service';

export class KitController {
  constructor(private readonly kitService: KitService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomeError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getAllKits = (req: Request, res: Response) => {
    this.kitService
      .getAllKits()
      .then((kit) => {
        res.status(200).json(kit);
      })
      .catch((err) => this.handleError(err, res));
  };

  getAllKitsWithProductsId = (req: Request, res: Response) => {
    this.kitService
      .getAllKitsWithProductsId()
      .then((kit) => {
        res.status(200).json(kit);
      })
      .catch((err) => this.handleError(err, res));
  };
}
