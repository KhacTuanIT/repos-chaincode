"use strict";

const ManufacturerContract = require("./lib/manufacturerContract");
const OrderDetailContract = require("./lib/orderDetailContract");
const ProductContract = require("./lib/productContract");
const ProductTypeContract = require("./lib/productTypeContract");
const SuppyContract = require("./lib/suppyContract");
const UserContract = require("./lib/userContract");

module.exports.ProductContract = ProductContract;
module.exports.SuppyContract = SuppyContract;
module.exports.UserContract = UserContract;
module.exports.ManufacturerContract = ManufacturerContract;
module.exports.ProductTypeContract = ProductTypeContract;
module.exports.OrderDetailContract = OrderDetailContract;
module.exports.contracts = [
  ProductContract,
  SuppyContract,
  UserContract,
  ManufacturerContract,
  ProductTypeContract,
  OrderDetailContract,
];
