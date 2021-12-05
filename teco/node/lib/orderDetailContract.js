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
    quantity,
    updated_by,
  ) {
    const orderDetail = {
      orderDetailId: orderDetailId,
      orderId: orderId,
      productId: productId,
      price: price,
      quantity: quantity,
      docType: "order-detail",
      is_delete: false,
      updated_by: updated_by,
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
    quantity,
    updated_by
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
    orderDetail.updated_by = updated_by;

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

  async getOrderDetailHistory(ctx, orderDetailId) {
    if (orderDetailId.length < 1) {
      throw new Error("orderDetailId is required as input");
    }

    var orderAsBytes = await ctx.stub.getState(orderDetailId);

    if (!orderAsBytes || orderAsBytes.length === 0) {
      throw new Error(
        `Error Message from getOrderDetailHistory: Order with orderDetailId = ${orderDetailId} does not exist.`
      );
    }

    const iterator = await ctx.stub.getHistoryForKey(orderDetailId);
    const orderDetailHistory = [];

    while (true) {
      let history = await iterator.next();

      if (history.value && history.value.value.toString()) {
        let jsonRes = {};
        jsonRes.TxId = history.value.txId;
        jsonRes.IsDelete = history.value.is_delete
          ? history.value.is_delete.toString()
          : "false";

        var d = new Date(0);
        d.setUTCSeconds(history.value.timestamp.seconds.low);
        jsonRes.Timestamp =
          d.toLocaleString("en-US", { timeZone: "America/Chicago" }) + " CST";

        try {
          jsonRes.Value = JSON.parse(history.value.value.toString("utf8"));
        } catch (err) {
          console.log(err);
          jsonRes.Value = history.value.value.toString("utf8");
        }

        orderDetailHistory.push(jsonRes);
      }

      if (history.done) {
        await iterator.close();
        return JSON.stringify(orderDetailHistory);
      }
    }
  }
}

module.exports = OrderDetailContract;
