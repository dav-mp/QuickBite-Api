import { prisma } from '../../../data/PrismaPostgresql';
import { JwtAdapter } from '../../../config/JWT';
import { HashData } from '../../../config/hashData';
import { getNewUUID } from '../../../config/uuid';
import { Prisma } from '@prisma/client';
import { LoginRestaurantDTO } from '../../../data/domain/dto/auth/loginRestaurant.dto';
import { CustomeError } from '../../../data/domain/errors/custom.error';

export class AuthRestaurantService {
  constructor() {}

  private errorControl = (error: unknown) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Error de Prisma:', error.message);
      throw CustomeError.internalServer(`Prisma error: ${error.meta?.field_name}`);
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      console.error('Error desconocido de Prisma:', error.message);
      throw CustomeError.internalServer(`Unknown Prisma error: ${error.message}`);
    } else {
      console.error('Error interno:', error);
      throw CustomeError.internalServer(`${error}`);
    }
  };

  public async loginRestaurant(restaurantDTO: LoginRestaurantDTO) {
    const { password, resId } = restaurantDTO;
    try {
      const auxRestaurant = await prisma.restaurant.findFirst({
        where: {
          resId,
        },
      });

      if (!auxRestaurant) {
        throw CustomeError.badRequest(`Credenciales incorrectas.`);
      }

      const isPassMatch = await HashData.hashDataPasswordCompare(password, auxRestaurant.password);
      if (!isPassMatch) {
        throw CustomeError.badRequest(`Credenciales incorrectas.`);
      }

      const { password: _, ...restaurantWithoutPassword } = auxRestaurant;

      const newJwt = await JwtAdapter.generateToken(restaurantWithoutPassword);
      if (!newJwt) {
        throw CustomeError.internalServer(`Error al iniciar sesion.`);
      }

      const shift = await this.checkRestaurantShift(restaurantWithoutPassword.id);

      return {
        restaurant: restaurantWithoutPassword,
        shift: shift,
        session: {
          token: newJwt,
        },
      };
    } catch (error) {
      this.errorControl(error);
    }
  }

  public async logoutRestaurant(restaurantId: string) {
    try {
      const auxRestaurant = await this.getRestaurantById(restaurantId);

      if (!auxRestaurant) {
        throw CustomeError.badRequest(`Tienda no encontrada.`);
      }

      const closeShift = await this.closeRestaurantShift(auxRestaurant.id);
      return closeShift;
    } catch (error) {
      this.errorControl(error);
    }
  }

  private async getRestaurantById(restaurantId: string) {
    try {
      const auxRestaurant = await prisma.restaurant.findUnique({
        where: {
          id: restaurantId,
        },
      });
      return auxRestaurant;
    } catch (error) {
      this.errorControl(error);
    }
  }

  private async closeRestaurantShift(restaurantId: string) {
    try {
      const shiftAct = await this.checkRestaurantShift(restaurantId);
      if (!shiftAct) {
        throw CustomeError.notFound('Not shift found.');
      }

      await prisma.shift.update({
        data: {
          closeShift: new Date(),
        },
        where: {
          id: shiftAct.id,
        },
      });

      return true;
    } catch (error) {
      this.errorControl(error);
    }
  }

  private async checkRestaurantShift(restaurantId: string) {
    try {
      const shift = await prisma.shift.findFirst({
        where: {
          closeShift: null,
          restaurantId,
        },
      });

      if (!shift) {
        return await this.createRestaurantShift(restaurantId);
      }
      return shift;
    } catch (error) {
      this.errorControl(error);
    }
  }

  private async createRestaurantShift(restaurantId: string) {
    try {
      const shiftCreate = await prisma.shift.create({
        data: {
          id: getNewUUID(),
          openShift: new Date(),
          restaurantId,
        },
      });
      return shiftCreate;
    } catch (error) {
      this.errorControl(error);
    }
  }
}
