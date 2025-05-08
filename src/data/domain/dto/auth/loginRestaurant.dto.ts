import { z } from 'zod';
import { errorsDTO } from '../interfaces/errorsDTO.interface';
import { simplifyErrors } from '../../../../utils';

interface ObjectDto {
  resId: string;
  password: string;
}

const zLoginRestaurantDTO = z.object({
  resId: z.string(),
  password: z.string().min(6).regex(/^(?=.*[a-z])(?=.*[A-Z])/, {
    message: 'The password must contain at least one lowercase letter and one uppercase letter.',
  }),
});

export class LoginRestaurantDTO {
  private constructor(public readonly resId: string, public readonly password: string) {}

  static create(object: ObjectDto): [errorsDTO[]?, LoginRestaurantDTO?] {
    const { resId, password } = object;
    const result = zLoginRestaurantDTO.safeParse(object);

    if (result.success) {
      return [undefined, new LoginRestaurantDTO(resId, password)];
    } else {
      const simplifiedErrors = simplifyErrors(result.error);
      return [simplifiedErrors];
    }
  }
}
