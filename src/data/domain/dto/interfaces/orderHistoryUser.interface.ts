export interface Order {
    id: string;
    customerId: string;
    retaurantId: string;
    orderDate: string;
    totalPrice: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    OrderDetail: OrderDetail[];
    Restaurant: Restaurant;
  }
  
  export interface OrderDetail {
    id: string;
    orderId: string;
    productId: string;
    productPriceEspecialId?: string;
    kitId?: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    Product: Product;
    Kit?: Kit;
  }
  
  export interface Product {
    id: string;
    name: string;
    categoryId: string;
    description: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    image: any;
  }
  
  export interface Kit {
    id: string;
    name: string;
    status: boolean;
    description: string;
    createdAt: string;
    updatedAt: string;
    image: any;
    KitPrice: KitPrice[];
  }
  
  export interface KitPrice {
    price: number;
  }
  
  export interface Restaurant {
    id: string;
    image: any;
    name: string;
    address: string;
  }
  