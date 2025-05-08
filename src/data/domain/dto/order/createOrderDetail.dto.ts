import { z } from 'zod';
import { errorsDTO } from '../interfaces/errorsDTO.interface';
import { OrderDetail } from '../interfaces/CreateOrderDetail.interface';
import { simplifyErrors } from '../../../../utils';

const zCreateOrderDetailDTO = z.object({
  productId: z.string().uuid(),
  quantity: z.number().gt(0),
  productPriceEspecialId: z.string().uuid().optional(),
  kitId: z.string().uuid().optional(),
});

const zCreateOrderDetail = z.object({
  data: z.array(zCreateOrderDetailDTO).nonempty(),
});

export class CreateOrderDetailDTO {
  private constructor(
    public readonly productId: string,
    public readonly quantity: number,
    public readonly productPriceEspecialId?: string,
    public readonly kitId?: string
  ) {}

  static create(data: OrderDetail[]): [errorsDTO[]?, CreateOrderDetailDTO[]?] {
    const auxData = {
      data,
    };

    const result = zCreateOrderDetail.safeParse(auxData);
    if (!result.success) {
      const simplifiedErrors = simplifyErrors(result.error);
      return [simplifiedErrors];
    }

    const dtos = data.map(
      (prod) => new CreateOrderDetailDTO(prod.productId, prod.quantity, prod.productPriceEspecialId, prod.kitId)
    );

    return [undefined, dtos];
  }
}
