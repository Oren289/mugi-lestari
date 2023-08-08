const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: String,
  username: {
    type: String,
    required: true,
  },
  products: {
    type: Array,
    default: [],
  },
  total: Number,
  userinfo: {
    type: Array,
    default: [],
  },
  timestamp: Date,
  orderStatus: String,
  paymentStatus: String,
  no_hp_umkm: String,
  username_umkm: String,
  grandTotal: Number,
});

const Order = new mongoose.model('order', orderSchema);

module.exports = Order;
