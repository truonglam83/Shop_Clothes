const SProduct = require("../../models/services/product");
const SCategory = require("../../models/services/category");
const { to } = require("await-to-js");
const getIndex = async (req, res, next) => {
  const [error, products] = await to(SProduct.getProducts());
  if (error) {
    console.log(error);
    return res.send("error occurs");
  }
  return res.render("admin/product", { page: "product", products: products });
};
const getCreate = async (req, res, next) => {
  const [error, categories] = await to(SCategory.getCategories());
  const Fcategories = categories.map((cate) => {
    return { _id: cate._id, name: cate.name };
  });
  return res.render("admin/product/create", {
    page: "product",
    categories: Fcategories,
  });
};
const getRemove = async (req, res, next) => {
  const productId = req.params.id;
  const [error] = await to(SProduct.deleteProduct(productId));
  if (error) {
    console.log(error);
    return res.redirect("/admin/product");
  }
  return res.redirect("/admin/product");
};
const getUpdate = async (req, res, next) => {
  const productId = req.params.id;
  let [error, product] = await to(SProduct.getProduct(productId));
  let [err, categories] = await to(SCategory.getCategories());
  const Fcategories = categories.map((cate) => {
    return { _id: cate._id, name: cate.name };
  });
  if (error) {
    console.log(error);
    return res.render("error/400");
  }
  return res.render("admin/product/edit", {
    page: "product",
    product: product._doc,
    categories: Fcategories,
  });
};
module.exports = { getIndex, getCreate, getRemove, getUpdate };
