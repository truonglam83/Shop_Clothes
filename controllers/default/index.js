const SProduct = require("../../models/services/product");
const { to } = require("await-to-js");
const getIndex = async (req, res, next) => {
  let user;
  if (req.user) {
    user = req.user;
  }
  const [error, products] = await to(SProduct.getProducts());
  if (error) {
    res.status(400);
    return res.render("error/400");
  }
  const topProducts = products.slice(0, 9);
  return res.render("default", {
    page: "home",
    products: topProducts,
    user: user,
  });
};
module.exports = { getIndex };
