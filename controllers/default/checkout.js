const EmailServices = require("../../models/services/email");
const OrderService = require("../../models/services/order");
const UserService = require("../../models/services/user");
const OrderModel = require("../../models/Order");
const { to } = require("await-to-js");

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const getIndex = (req, res, next) => {
  let user;
  if (req.user) {
    user = req.user;
  }
  return res.render("default/checkout", { page: "checkout", user: user });
};
const postIndex = (req, res) => {
  req.session.order = req.body;
  return res.json(req.body);
};
const getPayment = (req, res, next) => {
  let user;
  if (req.user) {
    user = req.user;
  }
  if (!req.user) {
    return res.redirect("/login-needed");
  }
  return res.render("default/payment", { page: "payment", user: user });
};
const postPayment = async (req, res, next) => {
  if (req.session.order) {
    const validCode = makeid(5);
    req.session.code = validCode;
    const email = req.session.order.email;
    await EmailServices.sendMail(email, validCode);
    return res.redirect("/checkout/valid");
  }
};
const getEmailValid = async (req, res, next) => {
  let user;
  if (req.user) {
    user = req.user;
  }
  return res.render("default/validCode", {
    page: "valid",
    user: user,
    error: null,
  });
};
const postEmailValid = async (req, res, next) => {
  let user;
  if (req.user) {
    user = req.user;
  }
  if (req.body.code === req.session.code) {
    const newOrder = new OrderModel({
      ...req.session.order,
      products: req.session.order.items,
    });
    var [error] = await to(newOrder.save());
    await UserService.addNewOrder(req.user._id, newOrder._id);

    return res.redirect("/user#history");
  } else
    return res.render("default/validCode", {
      page: "valid",
      user: user,
      error: "invalid code",
    });
};
module.exports = {
  getIndex,
  postIndex,
  getPayment,
  postPayment,
  getEmailValid,
  postEmailValid,
};
