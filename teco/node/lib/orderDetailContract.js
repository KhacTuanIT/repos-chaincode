"use strict";
const { Contract, Context } = require("fabric-contract-api");

class OrderDetailContract extends Contract {
  async initOrderDetail(ctx) {
    return;
  }

  async createOrderDetail(
    ctx,
    orderDetailId,
    orderId,
    productId,
    price,
    quantity
  ) {
    const orderDetail = {
      orderDetailId: orderDetailId,
      orderId: orderId,
      productId: productId,
      price: price,
      quantity: quantity,
      docType: "order-detail",
    };

    try {
      await ctx.stub.putState(
        orderDetailId,
        Buffer.from(JSON.stringify(orderDetail))
      );
      return JSON.stringify(orderDetail);
    } catch (error) {
      throw new Error(error);
    }
  }

  async queryOrderDetail(ctx, orderDetailId) {
    const orderDetailAsBytes = await ctx.stub.getState(orderDetailId);
    if (!orderDetailAsBytes || orderDetailAsBytes.length === 0) {
      throw new Error(`OrderDetail ${orderDetailId} does not exist`);
    }
    return orderDetailAsBytes.toString();
  }

  async queryAllOrderDetailsByOrderId(ctx, orderId) {
    const startKey = "";
    const endKey = "";
    const allOrderDetails = [];
    for await (const { key, value } of ctx.stub.getStateByRange(
      startKey,
      endKey
    )) {
      const strValue = Buffer.from(value).toString("utf8");
      let record;
      try {
        record = JSON.parse(strValue);
        if (record.docType === "order-detail" && record.orderId === orderId) {
          allOrderDetails.push({ Key: key, Value: record });
        }
      } catch (error) {
        throw new Error(error);
      }
    }
    return JSON.stringify(allOrderDetails);
  }

  async updateOrderDetail(
    ctx,
    orderDetailId,
    orderId,
    productId,
    price,
    quantity
  ) {
    const orderDetailAsBytes = await ctx.stub.getState(orderDetailId);
    if (!orderDetailAsBytes || orderDetailAsBytes.length === 0) {
      throw new Error(`OrderDetail ${orderDetailId} does not exist`);
    }
    const orderDetail = JSON.parse(orderDetailAsBytes.toString());

    orderDetail.orderId = orderId;
    orderDetail.productId = productId;
    orderDetail.price = price;
    orderDetail.quantity = quantity;

    try {
      await ctx.stub.putState(
        orderDetailId,
        Buffer.from(JSON.stringify(orderDetail))
      );
      return JSON.stringify(orderDetail);
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = OrderDetailContract;
