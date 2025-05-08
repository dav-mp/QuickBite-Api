
import { z } from 'zod';
import { errorsDTO } from '../interfaces/errorsDTO.interface';
import { simplifyErrors } from '../../../../utils';
import { StatusOrder } from '../interfaces';

const zChangeStatusOrder = z.object({
  restaurantId: z.string().uuid(),
  orderId: z.string().uuid(),
  status: z.enum([StatusOrder.Created, StatusOrder.Accepted, StatusOrder.Finalized]),
});

export class ChangeStatusOrderDTO {
  private constructor(
    public readonly restaurantId: string,
    public readonly orderId: string,
    public readonly status: StatusOrder
  ) {}

  static create(data: { [key: string]: any }): [errorsDTO[]?, ChangeStatusOrderDTO?] {
    const { restaurantId, orderId, status } = data;
    const result = zChangeStatusOrder.safeParse(data);

    if (!result.success) {
      const simplifiedErrors = simplifyErrors(result.error);
      return [simplifiedErrors];
    }
    return [undefined, new ChangeStatusOrderDTO(restaurantId, orderId, status)];
  }
}
