const UserModel = require("../User");
const ObjectId = require("mongoose").mongo.ObjectId;
const { to } = require("await-to-js");
const addNewOrder = async (userId, orderId) => {
  orderId = ObjectId(orderId);
  const [error, User] = await to(UserModel.findById(userId));
  if (error) return error;
  User.orders.push(orderId);
  User.save();
};
const getOrders = async (userId) => {
  const [error, user] = await to(
    UserModel.findById(userId).populate("orders").lean()
  );
  if (error) {
    console.log(error);
  }
  console.log(user);
  return user.orders;
};
module.exports = { addNewOrder, getOrders };
