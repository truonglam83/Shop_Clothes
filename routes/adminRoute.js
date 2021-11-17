const express = require("express");
const Router = express.Router();
const categoryController = require("../controllers/admin/category");
const productController = require("../controllers/admin/product");
// dashboard Page
Router.route("/").get((req, res) => {
  res.render("admin", { page: "dashboard" });
});

//category Page

Router.route("/category").get(categoryController.getIndex);

Router.route("/category/create").get(async (req, res) => {
  res.render("admin/category/create", { page: "category" });
});

Router.route("/category/edit/:id").get(categoryController.getEdit);
Router.route("/category/remove/:id").get(categoryController.getRemove);

// Product Page

Router.route("/product").get(productController.getIndex);

Router.route("/product/create").get(productController.getCreate);
Router.route("/product/remove/:id").get(productController.getRemove);
Router.route("/product/update/:id").get(productController.getUpdate);

// customer Page
Router.route("/customer").get((req, res) => {
  res.render("admin/customer", { page: "customer" });
});

//order Page
Router.route("/order").get((req, res) => {
  res.render("admin/order", { page: "order" });
});

//report Page
Router.route("/report").get((req, res) => {
  res.render("admin/report", { page: "report" });
});

module.exports = Router;
