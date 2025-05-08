// TODO: Hacer que reciba orderDetails pero que ahora sea de tipo OrderEntity

export const transformOrderDetail = (orderDetails: { [key: string]: any }): any => {
    const { singleProducts, kits } = orderDetails.OrderDetail.reduce(
      (acc: any, detail: any) => {
        if (detail.kitId) {
          // Es un producto que pertenece a un kit
          const kitId = detail.kitId;
          if (!acc.kits[kitId]) {
            acc.kits[kitId] = {
              id: detail.id,
              kitId: kitId,
              quantity: detail.quantity,
              Kit: detail.Kit,
              products: [],
            };
          }
          acc.kits[kitId].products.push({
            id: detail.id,
            productId: detail.productId,
            quantity: detail.quantity,
            Product: detail.Product,
          });
        } else {
          // Producto individual
          acc.singleProducts.push({
            id: detail.id,
            productId: detail.productId,
            quantity: detail.quantity,
            Product: detail.Product,
          });
        }
        return acc;
      },
      { singleProducts: [], kits: {} }
    );
  
    return {
      id: orderDetails.id,
      customerId: orderDetails.customerId,
      restaurantId: orderDetails.restaurantId,
      orderDate: orderDetails.orderDate,
      totalPrice: orderDetails.totalPrice,
      status: orderDetails.status,
      createdAt: orderDetails.createdAt,
      updatedAt: orderDetails.updatedAt,
      OrderDetail: {
        singleProducts,
        kits: Object.values(kits),
      },
      Customer: orderDetails.Customer,
      Restaurant: orderDetails.Restaurant,
    };
  };
  