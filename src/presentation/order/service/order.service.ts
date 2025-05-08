import { Prisma } from "@prisma/client/edge";
import { CustomeError } from "../../../data/domain/errors/custom.error";
import { prisma } from "../../../data/PrismaPostgresql";
import { CreateOrderDetailDTO } from "../../../data/domain/dto/order/createOrderDetail.dto";
import { getNewUUID } from "../../../config/uuid";
import { CreateOrderDTO } from "../../../data/domain/dto/order/createOrder.dto";
import { StatusOrder } from "../../../data/domain/dto/interfaces";
import { WSNotificationServer } from "../../websocket/WebSocketServer";
import { GetActiveOrdersDTO } from "../../../data/domain/dto/order/getActiveOrders.dto";
import { ChangeStatusOrderDTO } from "../../../data/domain/dto/order/changeStatusOrder.dto";


export class OrderService {
  constructor() {}

  private errorControl = (error: unknown) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Error de Prisma:", error.message);
      throw CustomeError.internalServer(`Prisma error: ${error.meta!.field_name}`);
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      console.error("Error desconocido de Prisma:", error.message);
      throw CustomeError.internalServer(`Unknown Prisma error: ${error.message}`);
    } else {
      console.error("Error:", error);
      throw CustomeError.internalServer(`Error: ${error}`);
    }
  };

  private findPriceEspecialByProductId = async (productId: string, kitId: string) => {
    try {
      const auxPriceSpecial = await prisma.productPriceEspecial.findFirst({
        select: { id: true },
        where: {
          productId: productId,
          kitId: kitId,
          status: true,
        },
      });
      console.log('PRECIO ESPECIAL', auxPriceSpecial);
      return auxPriceSpecial?.id;
    } catch (error) {
      console.log(error);
      this.errorControl(error);
    }
  };

  private createOrderDetail = async (orderDetail: CreateOrderDetailDTO[], orderId: string, dateAct: Date) => {
    try {
      const auxOrderDetail: any = [];
      for (const element of orderDetail) {
        auxOrderDetail.push({
          ...element,
          id: getNewUUID(),
          orderId,
          createdAt: dateAct,
          updatedAt: dateAct,
          productPriceEspecialId: element.kitId ? await this.findPriceEspecialByProductId(element.productId, element.kitId) : null,
          kitId: element.kitId ? element.kitId : null,
        });
      }
      const newOrderDetail = await prisma.orderDetail.createManyAndReturn({
        data: auxOrderDetail
      });
      return newOrderDetail;
    } catch (error) {
      console.log(error);
      this.errorControl(error);
    }
  };

  public getAllOrders = async () => {
    try {
      const orders = await prisma.order.findMany();
      return orders;
    } catch (error) {
      console.log(error);
      this.errorControl(error);
    }
  };

  public createOrder = async (order: CreateOrderDTO, orderDetail: CreateOrderDetailDTO[]) => {
    const { customerId, orderDate, restaurantId, totalPrice } = order;
    const dateAct = new Date();
    const auxOrderDate = new Date(orderDate * 1000).toISOString();

    try {
      const newOrder = await prisma.order.create({
        data: {
          id: getNewUUID(),
          customerId,
          retaurantId: restaurantId,
          orderDate: auxOrderDate,
          totalPrice,
          status: StatusOrder.Created,
          createdAt: dateAct,
          updatedAt: dateAct,
        }
      });

      const newOrderDetail = await this.createOrderDetail(orderDetail, newOrder.id, dateAct);

      console.log(newOrder);
      console.log(newOrderDetail);

      // Notifica al restaurante si está conectado via WS
      WSNotificationServer.getInstance().notify('restaurant', restaurantId, {
        event: 'order_created',
        order: newOrder
      });

      return {
        data: newOrder,
        status: true,
        code: 200
      };

    } catch (error) {
      console.log(error);
      this.errorControl(error);
    }
  };

  public getAllOrdersByCustomerId = async (customerId: string) => {
    try {
      const orders = await prisma.order.findMany({
        where: { customerId },
        include: {
          OrderDetail: {
            include: {
              Product: {
                include: {
                  ProductPrice: {
                    select: { price: true },
                    where: { status: true }
                  }
                }
              },
              Kit: {
                include: {
                  KitPrice: {
                    select: { price: true },
                    where: { status: true }
                  }
                }
              }
            }
          },
          Restaurant: {
            select: {
              id: true,
              image: true,
              name: true,
              address: true,
            }
          }
        }
      });
      return orders;
    } catch (error) {
      console.log(error);
      this.errorControl(error);
    }
  };

  public getActiveOrders = async (restaurant: GetActiveOrdersDTO) => {
    const { restaurantId } = restaurant;
    try {
      const orders = await prisma.order.findMany({
        where: {
          retaurantId: restaurantId,
          status: { in: [StatusOrder.Accepted, StatusOrder.Created] }
        },
        include: {
          Customer: {
            select: {
              name: true,
              phone: true,
              email: true,
              userName: true,
            }
          },
          OrderDetail: {
            include: {
              Product: {
                include: {
                  ProductPrice: {
                    select: { price: true },
                    where: { status: true }
                  }
                }
              },
              Kit: {
                include: {
                  KitPrice: {
                    select: { price: true },
                    where: { status: true }
                  }
                }
              }
            }
          }
        }
      });
      return orders;
    } catch (error) {
      console.log(error);
      this.errorControl(error);
    }
  };

  public geAllOrdersRestaurant = async (restaurant: GetActiveOrdersDTO) => {
    const { restaurantId } = restaurant;
    try {
      const orders = await prisma.order.findMany({
        where: { retaurantId: restaurantId },
        include: {
          OrderDetail: {
            include: {
              Product: {
                include: {
                  ProductPrice: {
                    select: { price: true },
                    where: { status: true }
                  }
                }
              },
              Kit: {
                include: {
                  KitPrice: {
                    select: { price: true },
                    where: { status: true }
                  }
                }
              }
            }
          }
        }
      });
      return orders;
    } catch (error) {
      console.log(error);
      this.errorControl(error);
    }
  };

  public changeStatusOrder = async (orderInfo: ChangeStatusOrderDTO) => {
    const { orderId, restaurantId, status } = orderInfo;
    try {
      const orderUpdate = await prisma.order.update({
        data: { status: status },
        where: {
          retaurantId: restaurantId,
          id: orderId,
        },
      });
      // Una vez actualizado el status, notifica al cliente (usuario) asociado a la orden.
      WSNotificationServer.getInstance().notify('user', orderUpdate.customerId, {
        event: 'order_status_changed',
        order: orderUpdate
      });
      return orderUpdate;
    } catch (error) {
      console.log(error);
      this.errorControl(error);
    }
  };
}
