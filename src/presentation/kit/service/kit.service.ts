import { CustomeError } from "../../../data/domain/errors/custom.error";
import { prisma } from "../../../data/PrismaPostgresql";

export class KitService {
  constructor() {}

  public async getAllKits() {
    try {
      const kits = await prisma.kit.findMany();
      return kits;
    } catch (error) {
      console.error(error);
      throw CustomeError.internalServer(`${error}`);
    }
  }

  public async getAllKitsWithProductsId() {
    try {
      const kits = await prisma.kit.findMany({
        include: {
          ProductKit: {
            select: {
              quantity: true,
              productId: true,
            },
          },
          KitPrice: {
            select: {
              price: true,
            },
            where: {
              status: true,
            },
          },
        },
      });
      return kits;
    } catch (error) {
      console.error(error);
      throw CustomeError.internalServer(`${error}`);
    }
  }
}
