import { CustomeError } from "../../../data/domain/errors/custom.error";
import { prisma } from "../../../data/PrismaPostgresql";

export class ProductsService {
  constructor() {}

  public async getAllProducts() {
    try {
      const products = await prisma.product.findMany();
      return products;
    } catch (error) {
      console.error(error);
      throw CustomeError.internalServer(`${error}`);
    }
  }

  public async getProductsActive() {
    try {
      const products = await prisma.product.findMany({
        where: {
          status: true,
        },
        include: {
          ProductPrice: true,
        },
      });
      return products;
    } catch (error) {
      console.error(error);
      throw CustomeError.internalServer(`${error}`);
    }
  }
}
