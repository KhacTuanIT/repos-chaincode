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
  minusProductFromCart
};
