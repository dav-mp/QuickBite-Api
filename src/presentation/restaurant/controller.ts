import { Request, Response } from 'express';
import { RestaurantService } from './service/restaurant.service';
import { CustomeError } from '../../data/domain/errors/custom.error';

export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomeError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getAllRestaurant = (req: Request, res: Response) => {
    this.restaurantService
      .getAllRestaurants()
      .then((restaurant) => {
        res.status(200).json(restaurant);
      })
      .catch((err) => this.handleError(err, res));
  };

  getRestaurantsOpen = (req: Request, res: Response) => {
    this.restaurantService
      .getRestaurantsOpen()
      .then((restaurant) => {
        res.status(200).json(restaurant);
      })
      .catch((err) => this.handleError(err, res));
  };

  getAllRestaurantsAnyShift = (req: Request, res: Response) => {
    this.restaurantService
      .getAllRestaurantsAnyShift()
      .then((restaurant) => {
        res.status(200).json(restaurant);
      })
      .catch((err) => this.handleError(err, res));
  };
}
