import { z } from 'zod';
import { errorsDTO } from '../interfaces/errorsDTO.interface';
import { simplifyErrors } from '../../../../utils';

interface ObjectDto {
  name: string;
  email: string;
  password: string;
  age: number;
  address: string;
  phone: string;
  userName?: string;
}

const zRegisterUserDTO = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: 'The password must contain at least one lowercase letter, one uppercase letter, and one number.',
    }),
  age: z.number(),
  address: z.string(),
  phone: z.string().min(10),
  userName: z.string().max(10).optional(),
});

export class RegisterUserDTO {
  private constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly age: number,
    public readonly address: string,
    public readonly phone: string,
    public readonly userName?: string
  ) {}

  static create(object: ObjectDto): [errorsDTO[]?, RegisterUserDTO?] {
    const { email, name, password, address, age, phone, userName } = object;
    const result = zRegisterUserDTO.safeParse(object);

    if (result.success) {
      return [undefined, new RegisterUserDTO(name, email, password, age, address, phone, userName)];
    } else {
      const simplifiedErrors = simplifyErrors(result.error);
      return [simplifiedErrors];
    }
  }
}
