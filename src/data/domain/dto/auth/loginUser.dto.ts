import { z } from 'zod';
import { errorsDTO } from '../interfaces/errorsDTO.interface';
import { simplifyErrors } from '../../../../utils';

interface ObjectDto {
  email: string;
  password: string;
}

const zLoginUserDTO = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: 'The password must contain at least one lowercase letter, one uppercase letter, and one number.',
    }),
});

export class LoginUserDTO {
  private constructor(public readonly email: string, public readonly password: string) {}

  static create(object: ObjectDto): [errorsDTO[]?, LoginUserDTO?] {
    const { email, password } = object;
    const result = zLoginUserDTO.safeParse(object);

    if (result.success) {
      return [undefined, new LoginUserDTO(email, password)];
    } else {
      const simplifiedErrors = simplifyErrors(result.error);
      return [simplifiedErrors];
    }
  }
}
