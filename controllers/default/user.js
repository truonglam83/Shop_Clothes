const User = require("../../models/User");
const { to } = require("await-to-js");
const UserServices = require("../../models/services/user");
const getIndex = async (req, res, next) => {
  let user;
  if (req.user) {
    user = req.user;
  }
  const orders = await UserServices.getOrders(req.user._id);
  return res.render("default/UserInfo", {
    user: user,
    orders: orders.reverse(),
  });
};
module.exports = { getIndex };
