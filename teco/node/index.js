"use strict";

const ManufacturerContract = require("./lib/manufacturerContract");
const OrderDetailContract = require("./lib/orderDetailContract");
const ProductContract = require("./lib/productContract");
const ProductTypeContract = require("./lib/productTypeContract");
const SupplyContract = require("./lib/supplyContract");
const UserContract = require("./lib/userContract");

module.exports.ProductContract = ProductContract;
module.exports.SupplyContract = SupplyContract;
module.exports.UserContract = UserContract;
module.exports.ManufacturerContract = ManufacturerContract;
module.exports.ProductTypeContract = ProductTypeContract;
module.exports.OrderDetailContract = OrderDetailContract;
module.exports.contracts = [
  ProductContract,
  SupplyContract,
  UserContract,
  ManufacturerContract,
  ProductTypeContract,
  OrderDetailContract,
];
