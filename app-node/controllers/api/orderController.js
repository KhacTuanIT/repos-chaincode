const Cart = require("../../models/cart");
const helper = require("../../utils/helperv2");

// const addProductToCart = async (req, res, next) => {
//   let productCode = req.params.id;
//   let org = req.query.org ? req.query.org : "supply";
//   try {
//     let productResult = await helper.getProduct(org, productCode);
//     if (productResult) {
//       let product = JSON.parse(productResult.toString());
//       let cart = new Cart(req.session.cart ? req.session.cart : {});
//       cart.add(product, productCode);
//       req.session.cart = cart;
//       res.json({ status: true, message: "Add product to cart successfully" });
//     } else {
//       res.status(404).json({
//         status: false,
//         message: "Product not found in system for add to cart",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       status: false,
//       message: error,
//     });
//   }
// };

const addProductToCart = async (req, res, next) => {
  let productCode = req.params.id;
  let amount = req.body.amount ? req.body.amount : "1";
  let org = req.query.org ? req.query.org : "supply";
  try {
    amount = parseInt(amount.toString());
    let productResult = await helper.getProduct(org, productCode);
    if (productResult) {
      let product = JSON.parse(productResult.toString());
      let cart = new Cart(req.session.cart ? req.session.cart : {});
      cart.addSpecific(product, productCode, amount);
      req.session.cart = cart;
      res.json({ status: true, message: "Add product to cart successfully" });
    } else {
      res.status(404).json({
        status: false,
        message: "Product not found in system for add to cart",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: error,
    });
  }
};

const removeProductFromCart = async (req, res, next) => {
  let productCode = req.params.id;
  try {
    let cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.remove(productCode);
    req.session.cart = cart;
    res.json({ status: true, message: "Remove product from cart succefully" });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server is updating! Please waiting a few...",
    });
  }
};

const minusProductFromCart = async (req, res, next) => {
  let productCode = req.params.id;
  try {
    let cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.minus(productCode);
    req.session.cart = cart;
    res.json({ status: true, message: "Remove product from cart succefully" });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server is updating! Please waiting a few...",
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

const assignShipper = async (req, res, next) => {
  let { orderId, newShipperId } = req.body;
  let org = req.query.org ? req.query.org : "supply";
  try {
    let userId = req.session.userId;
    if (userId) {
      let result = await helper.assignShipper(
        orderId,
        newShipperId,
        userId,
        org
      );
      let allOrder = JSON.parse(result.toString());
      await res.json({
        status: true,
        message: `Assign shipper for order successfully!`,
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
      message: "Assign shipper for order order fail. ERR: " + error.message,
    });
  }
};

const createShipment = async (req, res, next) => {
  let { orderId, newTrackingInfo } = req.body;
  let org = req.query.org ? req.query.org : "supply";
  try {
    let userId = req.session.userId;
    if (userId) {
      let result = await helper.createShipment(
        orderId,
        newTrackingInfo,
        userId,
        org
      );
      let allOrder = JSON.parse(result.toString());
      await res.json({
        status: true,
        message: `Create shipment for order successfully!`,
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
      message: "Create shipment for order fail. ERR: " + error.message,
    });
  }
};

const transitShipment = async (req, res, next) => {
  let { orderId } = req.body;
  let org = req.query.org ? req.query.org : "supply";
  try {
    let userId = req.session.userId;
    if (userId) {
      let result = await helper.transportShipment(orderId, userId, org);
      let allOrder = JSON.parse(result.toString());
      await res.json({
        status: true,
        message: `Transport shipment for order successfully!`,
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
      message: "Transport shipment for order fail. ERR: " + error.message,
    });
  }
};

const receiveShipment = async (req, res, next) => {
  let { orderId } = req.body;
  let org = req.query.org ? req.query.org : "supply";
  try {
    let userId = req.session.userId;
    if (userId) {
      let result = await helper.receiveShipment(orderId, userId, org);
      let allOrder = JSON.parse(result.toString());
      await res.json({
        status: true,
        message: `Receive shipment for order successfully!`,
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
      message: "Receive shipment for order fail. ERR: " + error.message,
    });
  }
};

const getCartItems = async (req, res, next) => {
  if (!req.session.cart) {
    return res.json({
      cart: {
        products: null,
        totalItems: 0,
        totalPrice: 0
      },
      status: true,
      message: "Get cart successfully",
    });
  }
  var cart = new Cart(req.session.cart);
  return res.json({
    cart: {
      products: cart.getItems(),
      totalPrice: cart.totalPrice,
      totalItems: cart.totalItems
    },
    status: true,
    message: "Get cart successfully",
  });
};

module.exports = {
  addProductToCart,
  removeProductFromCart,
  getCartItems,
  minusProductFromCart,
  createShipment,
  receiveOrder,
  receiveShipment,
  assignShipper,
  transitShipment
};
