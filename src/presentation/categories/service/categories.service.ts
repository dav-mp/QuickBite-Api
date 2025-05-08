import { CustomeError } from '../../../data/domain/errors/custom.error';
import { prisma } from '../../../data/PrismaPostgresql';

export class CategoriesService {
  constructor() {}

  public async getAllCategories() {
    try {
      const categories = await prisma.category.findMany();
      return categories;
    } catch (error) {
      console.error(error);
      throw CustomeError.internalServer(`${error}`);
    }
  }

  public async getCategoriesActive() {
    try {
      const categories = await prisma.category.findMany({
        where: {
          status: true,
        },
      });
      return categories;
    } catch (error) {
      console.error(error);
      throw CustomeError.internalServer(`${error}`);
    }
  }
}
