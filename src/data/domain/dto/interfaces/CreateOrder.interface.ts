import { OrderDetail } from "./CreateOrderDetail.interface";

export interface Order {
  customerId: string;
  restaurantId: string;
  orderDate: number;
  totalPrice: number;
  orderDetail: OrderDetail[];
}
