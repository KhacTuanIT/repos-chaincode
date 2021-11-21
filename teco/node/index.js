'use strict';

const ProductContract = require('./lib/productContract');
const SuppyContract = require('./lib/suppyContract');
const UserContract = require('./lib/userContract');

module.exports.ProductContract = ProductContract;
module.exports.SuppyContract = SuppyContract;
module.exports.UserContract = UserContract;
module.exports.contracts = [ProductContract, SuppyContract, UserContract];