import { LoginUserDTO } from '../../../data/domain/dto/auth/loginUser.dto';
import { RegisterUserDTO } from '../../../data/domain/dto/auth/registerUser.dto';
import { CustomeError } from '../../../data/domain/errors/custom.error';
import { prisma } from '../../../data/PrismaPostgresql';
import { AuthServiceProvider } from '../../../data/supabase/AuthServiceProvider';

export class AuthService {
  constructor(private readonly authServiceProvider: AuthServiceProvider) {}

  private getAuthServiceInstance = () => {
    return this.authServiceProvider.serviceProvider;
  };

  private async getUserByEmail(email: string) {
    try {
      const findUser = await prisma.customer.findFirst({
        where: {
          email: email,
        },
      });
      return findUser;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private async deleteProviderUserById(id: string) {
    const supabase = this.getAuthServiceInstance();
    await supabase.auth.admin.deleteUser(id);
  }

  public async registerUser(registerUserDTO: RegisterUserDTO) {
    const { name, password, email, phone, address, age, userName = '' } = registerUserDTO;

    const findUser = await this.getUserByEmail(email);
    if (findUser) {
      throw CustomeError.badRequest(`User already created`);
    }

    const supabase = this.getAuthServiceInstance();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          displayName: name,
        },
      },
    });

    if (error) {
      if (error.status === 429) throw CustomeError.internalServer(`Error creating user`);
      throw CustomeError.internalServer(`${error}`);
    }

    const { user: UserSupabase } = data;
    if (!UserSupabase) {
      throw CustomeError.internalServer(`Error al crear usuario en supabase`);
    }

    try {
      const newUser = await prisma.customer.create({
        data: {
          id: UserSupabase.id,
          address: address,
          age: age,
          name: name,
          phone: phone,
          email: email,
          userName: userName,
          status: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return newUser;
    } catch (error) {
      await this.deleteProviderUserById(UserSupabase.id);
      throw CustomeError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDTO: LoginUserDTO) {
    const { email, password } = loginUserDTO;
    const supabase = this.getAuthServiceInstance();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error?.status === 400) throw CustomeError.badRequest(`${error.message}`);
      throw CustomeError.internalServer(`${error}`);
    }

    return data;
  }
}
