import { Request, Response } from 'express';
import { AuthRestaurantService } from './service/restaurant.service';
import { AuthService } from './service/auth.service';
import { CustomeError } from '../../data/domain/errors/custom.error';
import { LoginRestaurantDTO } from '../../data/domain/dto/auth/loginRestaurant.dto';
import { RegisterUserDTO } from '../../data/domain/dto/auth/registerUser.dto';
import { LoginUserDTO } from '../../data/domain/dto/auth/loginUser.dto';

/**
 * Podríamos separar este controller en 2 archivos distintos (uno para restaurant y otro para user).
 * Pero aquí se mantiene en uno solo para ejemplificar.
 */
export class AuthRestaurantController {
  constructor(private readonly authRestaurantService: AuthRestaurantService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomeError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  };

  loginRestaurant = async (req: Request, res: Response) => {
    const [error, loginRestaurantDTO] = LoginRestaurantDTO.create(req.body);
    if (error) return res.status(400).json({ error });

    this.authRestaurantService
      .loginRestaurant(loginRestaurantDTO!)
      .then((restaurant) => {
        res.status(200).json(restaurant);
      })
      .catch((err) => this.handleError(err, res));
  };

  logoutRestaurant = async (req: Request, res: Response) => {
    const { restaurantId } = req.body;

    this.authRestaurantService
      .logoutRestaurant(restaurantId)
      .then((restaurant) => {
        res.status(200).json(restaurant);
      })
      .catch((err) => this.handleError(err, res));
  };
}

/**
 * Controller para User
 */
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomeError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  };

  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDTO] = RegisterUserDTO.create(req.body);
    if (error) return res.status(400).json({ error });

    this.authService
      .registerUser(registerUserDTO!)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => this.handleError(err, res));
  };

  loginUser = (req: Request, res: Response) => {
    const [error, loginUserDTO] = LoginUserDTO.create(req.body);
    if (error) return res.status(400).json({ error });

    this.authService
      .loginUser(loginUserDTO!)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => this.handleError(err, res));
  };
}
