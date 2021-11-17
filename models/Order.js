const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
  products: { type: Array },
  total: { type: Number },
  state: { type: Number, default: 0 },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  receiver: { type: String },
  creationDate: { type: Date, default: Date.now() },
  paymentCheck: { type: Boolean, default: true },
});
const OrderModel = mongoose.model("order", OrderSchema);
module.exports = OrderModel;
