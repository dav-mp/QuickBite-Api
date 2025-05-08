import { CustomeError } from "../../../data/domain/errors/custom.error";
import { prisma } from "../../../data/PrismaPostgresql";

export class RestaurantService {
  constructor() {}

  public async getAllRestaurants() {
    try {
      const restaurants = await prisma.restaurant.findMany();
      return {
        status: 200,
        data: restaurants,
      };
    } catch (error) {
      console.error(error);
      throw CustomeError.internalServer(`${error}`);
    }
  }

  public async getRestaurantsOpen() {
    try {
      const restaurantOpen = await prisma.shift.findMany({
        where: {
          closeShift: null,
        },
        include: {
          Restaurant: true,
        },
      });
      return {
        status: 200,
        data: restaurantOpen,
      };
    } catch (error) {
      console.error(error);
      throw CustomeError.internalServer(`${error}`);
    }
  }

  public async getAllRestaurantsAnyShift() {
    try {
      const restaurants = await prisma.restaurant.findMany({
        include: {
          Shift: {
            orderBy: {
              openShift: 'desc',
            },
            take: 1,
          },
        },
      });
      return {
        status: 200,
        data: restaurants,
      };
    } catch (error) {
      console.error(error);
      throw CustomeError.internalServer(`${error}`);
    }
  }
}
