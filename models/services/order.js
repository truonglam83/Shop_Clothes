const OrderModel = require("../Order");
const UserModel = require("../User");
const { to } = require("await-to-js");
const ObjectId = require("mongoose").mongo.ObjectId;
const createOrder = async (
  receiver,
  address,
  phone,
  email,
  products,
  total
) => {
  const newOrder = new OrderModel({
    products: products,
    total: total,
    phone: phone,
    email: email,
    receiver: receiver,
    address: address,
  });
  const [error] = await to(newOrder.save());
  if (error) return error;
};

const getOrders = async () => {
  const [error, orders] = await to(OrderModel.find().lean());
  if (error) {
    console.log(error);
  }
  return orders;
};
const updateStateOrder = async (orderId, state) => {
  const [error] = await to(
    OrderModel.findByIdAndUpdate(orderId, { state: state })
  );
  if (error) return error;
};
module.exports = { createOrder, updateStateOrder, getOrders };
