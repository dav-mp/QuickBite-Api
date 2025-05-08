import { z } from 'zod';
import { errorsDTO, OrderDetail } from '../interfaces';
import { CreateOrderDetailDTO } from './createOrderDetail.dto';
import { simplifyErrors } from '../../../../utils';

const zCreateOrderDTO = z.object({
  customerId: z.string().uuid(),
  restaurantId: z.string().uuid(),
  orderDate: z.number(),
  totalPrice: z.number(),
  orderDetail: z.array(z.any()),
});

export class CreateOrderDTO {
  private constructor(
    public readonly customerId: string,
    public readonly restaurantId: string,
    public readonly orderDate: number,
    public readonly totalPrice: number,
    public readonly orderDetail: OrderDetail[]
  ) {}

  static create(object: CreateOrderDTO): [errorsDTO[]?, CreateOrderDTO?] {
    const { customerId, restaurantId, orderDate, totalPrice, orderDetail } = object;
    const result = zCreateOrderDTO.safeParse(object);

    if (result.success) {
      return [undefined, new CreateOrderDTO(customerId, restaurantId, orderDate, totalPrice, orderDetail)];
    } else {
      const simplifiedErrors = simplifyErrors(result.error);
      return [simplifiedErrors];
    }
  }
}
