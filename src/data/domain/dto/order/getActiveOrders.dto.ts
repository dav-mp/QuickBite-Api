import { z } from 'zod';
import { errorsDTO } from '../interfaces/errorsDTO.interface';
import { simplifyErrors } from '../../../../utils';

const zGetActiveOrders = z.object({
  restaurantId: z.string().uuid(),
});

export class GetActiveOrdersDTO {
  private constructor(public readonly restaurantId: string) {}

  static create(restaurantId: string): [errorsDTO[]?, GetActiveOrdersDTO?] {
    const result = zGetActiveOrders.safeParse({ restaurantId });

    if (!result.success) {
      const simplifiedErrors = simplifyErrors(result.error);
      return [simplifiedErrors];
    }
    return [undefined, new GetActiveOrdersDTO(restaurantId)];
  }
}
