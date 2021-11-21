'use strict';
const { Contract, Context } = require('fabric-contract-api');

const Order = require('./order.js');
const OrderStates = require('./order.js').orderStates;

class SupplyContext extends Context {
    constructor() {
        super();
    }
}

class SupplyContract extends Contract {
    constructor() {
        super('teco.papernet.supplycontract');
    }

    createContext() {
        return new SupplyContext();
    }

    async initSupply() {
        console.log('instantiate the contract');
    }

    async orderProduct(ctx, orderId, productId, price, quantity, producerId, retailerId, modifiedBy, buyerId) {

        console.log("incoming asset fields: " + JSON.stringify());
        var orderAsBytes = await ctx.stub.getState(orderId);
        if (orderAsBytes && orderAsBytes.length > 0) {
            throw new Error(`Error Message from orderProduct. Order with orderId = ${orderId} already exists.`);
        }

        let order = Order.createInstance(orderId);
        order.productId = productId;
        order.price = price.toString();
        order.quantity = quantity.toString();
        order.producerId = producerId;
        order.retailerId = retailerId;
        order.modifiedBy = modifiedBy;
        order.buyerId = buyerId;
        order.currentOrderState = OrderStates.ORDER_CREATED;
        order.trackingInfo = '';
        order.docType = 'order';

        await ctx.stub.putState(orderId, Buffer.from(JSON.stringify(order)));

        return JSON.stringify(order);
    }

    async receiveOrder(ctx, orderId, userId) {
        console.info('============= receiveOrder ===========');

        if (orderId.length < 1) {
            throw new Error('orderId is required as input')
        }

        var orderAsBytes = await ctx.stub.getState(orderId);
        if (!orderAsBytes || orderAsBytes.length === 0) {
            throw new Error(`Error Message from receiveOrder: Order with orderId = ${orderId} does not exist.`);
        }

        var order = Order.deserialize(orderAsBytes);

        order.setStateToOrderReceived();

        order.modifiedBy = userId;

        await ctx.stub.putState(orderId, Buffer.from(JSON.stringify(order)));

        return JSON.stringify(order);
    }

    async assignShipper(ctx, orderId, newShipperId, userId) {
        console.info('============= assignShipper ===========');

        if (orderId.length < 1) {
            throw new Error('orderId is required as input')
        }

        if (newShipperId.length < 1) {
            throw new Error('shipperId is required as input')
        }

        var orderAsBytes = await ctx.stub.getState(orderId);
        if (!orderAsBytes || orderAsBytes.length === 0) {
            throw new Error(`Error Message from assignShipper: Order with orderId = ${orderId} does not exist.`);
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
            throw new Error('orderId is required as input')
        }

        if (newTrackingInfo.length < 1) {
            throw new Error('Tracking # is required as input')
        }

        var orderAsBytes = await ctx.stub.getState(orderId);
        if (!orderAsBytes || orderAsBytes.length === 0) {
            throw new Error(`Error Message from createShipment: Order with orderId = ${orderId} does not exist.`);
        }

        var order = Order.deserialize(orderAsBytes);

        order.setStateToShipmentCreated();
        order.trackingInfo = newTrackingInfo;
        order.modifiedBy = userId;

        await ctx.stub.putState(orderId, Buffer.from(JSON.stringify(order)));

        return JSON.stringify(order);
    }

    async transportShipment(ctx, orderId, userId) {
        console.info('============= transportShipment ===========');

        if (orderId.length < 1) {
            throw new Error('orderId is required as input')
        }

        var orderAsBytes = await ctx.stub.getState(orderId);
        if (!orderAsBytes || orderAsBytes.length === 0) {
            throw new Error(`Error Message from transportShipment: Order with orderId = ${orderId} does not exist.`);
        }

        var order = Order.deserialize(orderAsBytes);

        order.setStateToShipmentInTransit();
        order.modifiedBy = userId;

        await ctx.stub.putState(orderId, Buffer.from(JSON.stringify(order)));

        return JSON.stringify(order);
    }

    async receiveShipment(ctx, orderId, userId) {
        console.info('============= receiveShipment ===========');

        if (orderId.length < 1) {
            throw new Error('orderId is required as input')
        }

        var orderAsBytes = await ctx.stub.getState(orderId);
        if (!orderAsBytes || orderAsBytes.length === 0) {
            throw new Error(`Error Message from receiveShipment: Order with orderId = ${orderId} does not exist.`);
        }

        var order = Order.deserialize(orderAsBytes);
        order.setStateToShipmentReceived();
        order.modifiedBy = userId;

        await ctx.stub.putState(orderId, Buffer.from(JSON.stringify(order)));

        return JSON.stringify(order);
    }

    async queryOrder(ctx, orderId) {
        console.info('============= queryOrder ===========');

        if (orderId.length < 1) {
            throw new Error('orderId is required as input')
        }

        var orderAsBytes = await ctx.stub.getState(orderId);

        if (!orderAsBytes || orderAsBytes.length === 0) {
            throw new Error(`Error Message from queryOrder: Order with orderId = ${orderId} does not exist.`);
        }

        return orderAsBytes.toString();
    }

    async queryAllOrders(ctx) {
        const startKey = '';
        const endKey = '';
        const allOrders = [];
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
                if (record.docType === 'order') {
                    allOrders.push({ Key: key, Value: record });
                }
            } catch (error) {
                console.log(error);
            }
        }
        return JSON.stringify(allOrders);
    }

    async getOrderHistory(ctx, orderId) {
        console.info('============= getOrderHistory ===========');
        if (orderId.length < 1) {
            throw new Error('orderId is required as input')
        }
        console.log("input, orderId = " + orderId);

        var orderAsBytes = await ctx.stub.getState(orderId);

        if (!orderAsBytes || orderAsBytes.length === 0) {
            throw new Error(`Error Message from getOrderHistory: Order with orderId = ${orderId} does not exist.`);
        }

        console.info('start GetHistoryForOrder: %s', orderId);

        const iterator = await ctx.stub.getHistoryForKey(orderId);
        const orderHistory = [];

        while (true) {
            let history = await iterator.next();

            if (history.value && history.value.value.toString()) {
                let jsonRes = {};
                jsonRes.TxId = history.value.tx_id;
                jsonRes.IsDelete = history.value.is_delete.toString();

                var d = new Date(0);
                d.setUTCSeconds(history.value.timestamp.seconds.low);
                jsonRes.Timestamp = d.toLocaleString("en-US", { timeZone: "America/Chicago" }) + " CST";

                try {
                    jsonRes.Value = JSON.parse(history.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Value = history.value.value.toString('utf8');
                }

                orderHistory.push(jsonRes);
            }

            if (history.done) {
                console.log('end of data');
                await iterator.close();
                console.info(orderHistory);
                return JSON.stringify(orderHistory);
            }
        }
    }

    async deleteOrder(ctx, orderId) {

        console.info('============= deleteOrder ===========');
        if (orderId.length < 1) {
            throw new Error('Order Id required as input')
        }
        console.log("orderId = " + orderId);

        var orderAsBytes = await ctx.stub.getState(orderId);

        if (!orderAsBytes || orderAsBytes.length === 0) {
            throw new Error(`Error Message from deleteOrder: Order with orderId = ${orderId} does not exist.`);
        }

        await ctx.stub.deleteState(orderId);
    }

    /**
      * getCurrentUserId
      * To be called by application to get the type for a user who is logged in
      *
      * @param {Context} ctx the transaction context
      * Usage:  getCurrentUserId ()
     */
    async getCurrentUserId(ctx) {

        let id = [];
        id.push(ctx.clientIdentity.getID());
        var begin = id[0].indexOf("/CN=");
        var end = id[0].lastIndexOf("::/C=");
        let userid = id[0].substring(begin + 4, end);
        return userid;
    }

    /**
      * getCurrentUserType
      * To be called by application to get the type for a user who is logged in
      *
      * @param {Context} ctx the transaction context
      * Usage:  getCurrentUserType ()
     */
    async getCurrentUserType(ctx) {

        let userid = await this.getCurrentUserId(ctx);

        //  check user id;  if admin, return type = admin;
        //  else return value set for attribute "type" in certificate;
        if (userid == "admin") {
            return userid;
        }
        return ctx.clientIdentity.getAttributeValue("usertype");
    }

    static toBuffer(data) {
        return Buffer.from(JSON.stringify(data));
    }

    static fromBuffer(buffer) {
        return Order.deserialize(Buffer.from(JSON.parse(buffer)));
    }
}

module.exports = SupplyContract;