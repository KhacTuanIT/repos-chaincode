module.exports = function Cart(cart) {
  this.items = cart.items || {};
  this.totalItems = cart.totalItems || 0;
  this.totalPrice = cart.totalPrice || 0;

  this.add = function (item, id) {
    var cartItem = this.items[id];
    if (!cartItem) {
      cartItem = this.items[id] = { item: item, quantity: 0, price: 0 };
    }
    cartItem.quantity++;
    cartItem.price = parseInt(cartItem.item.price) * cartItem.quantity;
    this.totalItems++;
    this.totalPrice += parseInt(cartItem.item.price);
  };

  this.addSpecific = function (item, id, amount) {
    var cartItem = this.items[id];
    if (!cartItem) {
      cartItem = this.items[id] = { item: item, quantity: 0, price: 0 };
    }
    cartItem.quantity += amount;
    cartItem.price = parseInt(cartItem.item.price) * cartItem.quantity;
    this.totalItems += amount;
    this.totalPrice += parseInt(cartItem.item.price) * amount;
  };

  this.remove = function (id) {
    this.totalItems -= this.items[id].quantity;
    this.totalPrice -= this.items[id].price;
    delete this.items[id];
  };

  this.minus = function (id) {
    if (this.items[id].quantity == 1) this.remove(id);
    else {
      this.items[id].quantity -= 1;
      this.items[id].price -= this.items[id].item.price;
      this.totalPrice -= this.items[id].item.price;
      this.totalItems -= 1;
    }
  };

  this.getItems = function () {
    var arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
};
