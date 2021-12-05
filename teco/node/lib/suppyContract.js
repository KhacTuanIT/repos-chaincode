"use strict";
const { Contract, Context } = require("fabric-contract-api");

const Order = require("./order.js");
const OrderStates = require("./order.js").orderStates;

class SupplyContext extends Context {
  constructor() {
    super();
  }
}

class SupplyContract extends Contract {
  constructor() {
    super("teco.papernet.supplycontract");
  }

  createContext() {
    return new SupplyContext();
  }

  async initSupply() {
    console.log("instantiate the contract");
  }

  async orderProduct(
    ctx,
    orderId,
    productId,
    price,
    producerId,
    retailerId,
    modifiedBy,
    buyerId,
    updated_by
  ) {
    var orderAsBytes = await ctx.stub.getState(orderId);
    if (orderAsBytes && orderAsBytes.length > 0) {
      throw new Error(
        `Error Message from orderProduct. Order with orderId = ${orderId} already exists.`
      );
    }

    let order = Order.createInstance(orderId);
    order.productId = productId;
    order.price = price.toString();
    order.producerId = producerId;
    order.retailerId = retailerId;
    order.modifiedBy = modifiedBy;
    order.buyerId = buyerId;
    order.currentOrderState = OrderStates.ORDER_CREATED;
    order.trackingInfo = "";
    order.docType = "order";
    order.is_delete = false;

    await ctx.stub.putState(orderId, Buffer.from(JSON.stringify(order)));

    return JSON.stringify(order);
  }

  async receiveOrder(ctx, orderId, userId) {
    if (orderId.length < 1) {
      throw new Error("orderId is required as input");
    }

    var orderAsBytes = await ctx.stub.getState(orderId);
    if (!orderAsBytes || orderAsBytes.length === 0) {
      throw new Error(
        `Error Message from receiveOrder: Order with orderId = ${orderId} does not exist.`
      );
    }

    var order = Order.deserialize(orderAsBytes);

    order.setStateToOrderReceived();

    order.modifiedBy = userId;

    await ctx.stub.putState(orderId, Buffer.from(JSON.stringify(order)));

    return JSON.stringify(order);
  }

  async assignShipper(ctx, orderId, newShipperId, userId) {
    if (orderId.length < 1) {
      throw new Error("orderId is required as input");
    }

    if (newShipperId.length < 1) {
      throw new Error("shipperId is required as input");
    }

    var orderAsBytes = await ctx.stub.getState(orderId);
    if (!orderAsBytes || orderAsBytes.length === 0) {
      throw new Error(
        `Error Message from assignShipper: Order with orderId = ${orderId} does not exist.`
      );
    }

    var order = Order.deserialize(orderAsBytes);

    order.setStateToShipmentAssigned();
    order.shipperId = newShipperId;
    order.modifiedBy = userId;

    await ctx.stub.putState(orderId, Buffer.from(JSON.stringify(order)));

    return JSON.stringify(order);
  }

  async createShipment(ctx, orderId, newTrackingInfo, userId) {
    if (orderId.length < 1) {
      throw new Error("orderId is required as input");
    }

    if (newTrackingInfo.length < 1) {
      throw new Error("Tracking # is required as input");
    }

    var orderAsBytes = await ctx.stub.getState(orderId);
    if (!orderAsBytes || orderAsBytes.length === 0) {
      throw new Error(
        `Error Message from createShipment: Order with orderId = ${orderId} does not exist.`
      );
    }

    var order = Order.deserialize(orderAsBytes);

    order.setStateToShipmentCreated();
    order.trackingInfo = newTrackingInfo;
    order.modifiedBy = userId;

    await ctx.stub.putState(orderId, Buffer.from(JSON.stringify(order)));

    return JSON.stringify(order);
  }

  async transportShipment(ctx, orderId, userId) {
    if (orderId.length < 1) {
      throw new Error("orderId is required as input");
    }

    var orderAsBytes = await ctx.stub.getState(orderId);
    if (!orderAsBytes || orderAsBytes.length === 0) {
      throw new Error(
        `Error Message from transportShipment: Order with orderId = ${orderId} does not exist.`
      );
    }

    var order = Order.deserialize(orderAsBytes);

    order.setStateToShipmentInTransit();
    order.modifiedBy = userId;

    await ctx.stub.putState(orderId, Buffer.from(JSON.stringify(order)));

    return JSON.stringify(order);
  }

  async receiveShipment(ctx, orderId, userId) {
    if (orderId.length < 1) {
      throw new Error("orderId is required as input");
    }

    var orderAsBytes = await ctx.stub.getState(orderId);
    if (!orderAsBytes || orderAsBytes.length === 0) {
      throw new Error(
        `Error Message from receiveShipment: Order with orderId = ${orderId} does not exist.`
      );
    }

    var order = Order.deserialize(orderAsBytes);
    order.setStateToShipmentReceived();
    order.modifiedBy = userId;

    await ctx.stub.putState(orderId, Buffer.from(JSON.stringify(order)));

    return JSON.stringify(order);
  }

  async queryOrder(ctx, orderId) {
    if (orderId.length < 1) {
      throw new Error("orderId is required as input");
    }

    var orderAsBytes = await ctx.stub.getState(orderId);

    if (!orderAsBytes || orderAsBytes.length === 0) {
      throw new Error(
        `Error Message from queryOrder: Order with orderId = ${orderId} does not exist.`
      );
    }

    return orderAsBytes.toString();
  }

  async queryAllOrders(ctx) {
    const startKey = "";
    const endKey = "";
    const allOrders = [];
    for await (const { key, value } of ctx.stub.getStateByRange(
      startKey,
      endKey
    )) {
      const strValue = Buffer.from(value).toString("utf8");
      let record;
      try {
        record = JSON.parse(strValue);
        if (record.docType === "order") {
          allOrders.push({ Key: key, Value: record });
        }
      } catch (error) {
        throw new Error(error);
      }
    }
    return JSON.stringify(allOrders);
  }

  async getOrderHistory(ctx, orderId) {
    if (orderId.length < 1) {
      throw new Error("orderId is required as input");
    }

    var orderAsBytes = await ctx.stub.getState(orderId);

    if (!orderAsBytes || orderAsBytes.length === 0) {
      throw new Error(
        `Error Message from getOrderHistory: Order with orderId = ${orderId} does not exist.`
      );
    }

    const iterator = await ctx.stub.getHistoryForKey(orderId);
    const orderHistory = [];

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

        orderHistory.push(jsonRes);
      }

      if (history.done) {
        await iterator.close();
        return JSON.stringify(orderHistory);
      }
    }
  }

  async deleteOrder(ctx, orderId) {
    if (orderId.length < 1) {
      throw new Error("Order Id required as input");
    }

    var orderAsBytes = await ctx.stub.getState(orderId);

    if (!orderAsBytes || orderAsBytes.length === 0) {
      throw new Error(
        `Error Message from deleteOrder: Order with orderId = ${orderId} does not exist.`
      );
    }
    var order = Order.deserialize(orderAsBytes);
    order.is_delete = true;
    await ctx.stub.putState(orderId, Buffer.from(JSON.stringify(order)));
  }
}

module.exports = SupplyContract;
