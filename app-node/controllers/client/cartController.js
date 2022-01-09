const helper = require("./../../utils/helperv2");
const Cart = require("../../models/cart");
const cartView = (req, res, next) => {
  res.render("client/cart", { layout: "client-layout", page_name: "cart" });
};

const addOrder = async (req, res, next) => {
  let { retailerId } = req.body;
  let order = {
    retailerId,
    updated_by: "",
  };
  let org = req.body.org ? req.body.org : "supply";
  try {
    let buyerId = req.session.userId ? req.session.userId : "";
    let cart = new Cart(req.session.cart ? req.session.cart : {});
    let cartItems = cart.getItems();
    if (cartItems.length > 0) {
      if (buyerId) {
        let allOrderResult = await helper.queryAllOrders(org);
        let allOrder = JSON.parse(allOrderResult.toString());
        if (allOrder) {
          let count = allOrder.length > 0 ? allOrder.length + 1 : 1;
          order.orderId = "OD" + ("000000" + count).slice(-7);
        } else {
          order.orderId = "OD" + "0000001".slice(-7);
        }
        order.price = cart.totalPrice;
        order.retailerId = "admin";
        order.buyerId = buyerId;
        let result = await helper.addOrder(order, org);
        if (result) {
          let orderDetail = undefined;

          cartItems.forEach(async (item) => {
            try {
              console.log(item);
              orderDetail = {
                orderDetailId: helper.uuidv4(),
                orderId: order.orderId,
                productId: item.item.code,
                price: item.item.price,
                quantity: item.quantity,
                updated_by: "",
              };
              let rs = await helper.createOrderDetail(orderDetail, org);
              if (rs) {
                console.log(rs);
              }
            } catch (error) {
              console.log(error);
            }
          });
          delete req.session.cart;
          await res.json({
            status: true,
            message: `Add order for ${buyerId} successfully!`,
            data: JSON.parse(result.toString()),
          });
        }
      } else {
        await res.status(401).json({
          status: false,
          message: `Please login to use feature!`,
          data: "",
        });
      }
    } else {
      await res.status(422).json({
        status: false,
        message: `Your cart is empty!`,
        data: "",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Add order fail. ERR: " + error.message,
    });
  }
};

const queryOrderByUserId = async (req, res, next) => {
  let userId = req.session.userId;
  let org = req.query.org ? req.query.org : "supply";
  if (userId) {
    try {
      let result = await helper.queryAllOrdersByUserId(userId, org);
      let allOrder = JSON.parse(result.toString());
      await res.json({
        status: true,
        message: `Get order for ${userId} successfully!`,
        data: allOrder,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Get order fail. ERR: " + error.message,
      });
    }
  } else {
    res.status(401).json({
      status: false,
      message: "Get order fail. ERR: " + error.message,
    });
  }
};

const queryAllOrder = async (req, res, next) => {
  let org = req.query.org ? req.query.org : "supply";
  try {
    let result = await helper.queryAllOrders(org);
    let allOrder = JSON.parse(result.toString());
    await res.json({
      status: true,
      message: `Get all order  successfully!`,
      data: allOrder,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Get order fail. ERR: " + error.message,
    });
  }
};

const queryOrder = async (req, res, next) => {
  let orderId = req.params.id;
  let org = req.query.org ? req.query.org : "supply";
  try {
    let result = await helper.queryOrder(orderId, org);
    let allOrder = JSON.parse(result.toString());
    await res.json({
      status: true,
      message: `Get all order  successfully!`,
      data: allOrder,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Get order fail. ERR: " + error.message,
    });
  }
};

const receiveOrder = async (req, res, next) => {
  let { orderId } = req.body;
  let org = req.query.org ? req.query.org : "supply";
  try {
    let userId = req.session.userId;
    if (userId) {
      let result = await helper.receiceOrder(orderId, userId, org);
      let allOrder = JSON.parse(result.toString());
      await res.json({
        status: true,
        message: `Receive order  successfully!`,
        data: allOrder,
      });
    } else {
      res.status(401).json({
        status: false,
        message: "Please login to use feature ",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Receive order fail. ERR: " + error.message,
    });
  }
};

const queryOrderHistory = async (req, res, next) => {
  let orderId = req.params.id;
  let org = req.query.org ? req.query.org : "supply";
  try {
    console.log(orderId);
    let orderHistory = await helper.getHistoryOrder(orderId, org);
    console.log(orderHistory);
    let orderHistoryParse = JSON.parse(orderHistory.toString());
    await res.json({
      status: true,
      message: "get successfully",
      data: orderHistoryParse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Receive shipment for order fail. ERR: " + error.message,
    });
  }
};

module.exports = {
  cartView,
  addOrder,
  queryOrderByUserId,
  queryOrder,
  queryAllOrder,
  receiveOrder,
  queryOrderHistory,
};
