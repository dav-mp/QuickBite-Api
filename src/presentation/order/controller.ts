import { Request, Response } from 'express';

import { transformOrderDetail } from '../../utils';
import { CustomeError } from '../../data/domain/errors/custom.error';
import { OrderService } from './service/order.service';
import { CreateOrderDTO } from '../../data/domain/dto/order/createOrder.dto';
import { CreateOrderDetailDTO } from '../../data/domain/dto/order/createOrderDetail.dto';
import { GetActiveOrdersDTO } from '../../data/domain/dto/order/getActiveOrders.dto';
import { ChangeStatusOrderDTO } from '../../data/domain/dto/order/changeStatusOrder.dto';

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomeError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getAllOrders = (req: Request, res: Response) => {
    this.orderService
      .getAllOrders()
      .then((order) => {
        res.status(200).json(order);
      })
      .catch((err) => this.handleError(err, res));
  };

  createOrder = (req: Request, res: Response) => {
    const [errorOrder, orderDTO] = CreateOrderDTO.create(req.body);
    if (errorOrder) return res.status(400).json({ errorOrder });

    const [errorDetail, detailDTO] = CreateOrderDetailDTO.create(orderDTO!.orderDetail);
    if (errorDetail) return res.status(400).json({ errorDetail });

    this.orderService
      .createOrder(orderDTO!, detailDTO!)
      .then((order) => {
        res.status(200).json(order);
      })
      .catch((err) => this.handleError(err, res));
  };

  getAllOrdersByCustomerId = (req: Request, res: Response) => {
    const { customerId } = req.body;
    if (!customerId) {
      return res.status(400).json({ error: 'customerId is required.' });
    }

    this.orderService
      .getAllOrdersByCustomerId(customerId)
      .then((orders) => {
        const auxOrder = orders?.map((order) => transformOrderDetail(order));
        res.status(200).json(auxOrder);
      })
      .catch((err) => this.handleError(err, res));
  };

  getActiveOrders = (req: Request, res: Response) => {
    const [error, getActiveOrdersDTO] = GetActiveOrdersDTO.create(req.body.restaurantId);
    if (error) return res.status(400).json({ error });

    this.orderService
      .getActiveOrders(getActiveOrdersDTO!)
      .then((orders) => {
        const auxOrder = orders?.map((order) => transformOrderDetail(order));
        res.status(200).json(auxOrder);
      })
      .catch((err) => this.handleError(err, res));
  };

  geAllOrdersRestaurant = (req: Request, res: Response) => {
    const [error, getActiveOrdersDTO] = GetActiveOrdersDTO.create(req.body.restaurantId);
    if (error) return res.status(400).json({ error });

    this.orderService
      .geAllOrdersRestaurant(getActiveOrdersDTO!)
      .then((orders) => {
        const auxOrder = orders?.map((order) => transformOrderDetail(order));
        res.status(200).json(auxOrder);
      })
      .catch((err) => this.handleError(err, res));
  };

  changeStatusOrder = (req: Request, res: Response) => {
    const [error, changeStatusOrderDTO] = ChangeStatusOrderDTO.create(req.body);
    if (error) return res.status(400).json({ error });

    this.orderService
      .changeStatusOrder(changeStatusOrderDTO!)
      .then((order) => {
        res.status(200).json(order);
      })
      .catch((err) => this.handleError(err, res));
  };
}
