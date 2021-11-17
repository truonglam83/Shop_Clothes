const Router = require("express").Router();
const categoryAPI = require("./category");
const productAPI = require("./product");
Router.use("/categories", categoryAPI);
Router.use("/products", productAPI);
module.exports = Router;
