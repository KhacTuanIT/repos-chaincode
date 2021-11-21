'use strict';

const Manufacturer = require('./lib/manufacturerContract');
const OrderDetail = require('./lib/orderDetailContract');
const ProductContract = require('./lib/productContract');
const ProductType = require('./lib/productTypeContract');
const SuppyContract = require('./lib/suppyContract');
const UserContract = require('./lib/userContract');

module.exports.ProductContract = ProductContract;
module.exports.SuppyContract = SuppyContract;
module.exports.UserContract = UserContract;
module.exports.Manufacturer = Manufacturer;
module.exports.ProductType = ProductType;
module.exports.OrderDetail = OrderDetail;
module.exports.contracts = [ProductContract, SuppyContract, UserContract, Manufacturer, ProductType, OrderDetail];
