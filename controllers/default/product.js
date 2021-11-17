const SProduct = require("../../models/services/product");
const { to } = require("await-to-js");
const Category = require("../../models/Category");
function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
}
const getIndex = async (req, res, next) => {
  let user;
  if (req.user) {
    user = req.user;
  }
  const query = req.query;
  const categories = await Category.find();
  console.log(query);
  if (isEmpty(query)) {
    const [error, products] = await to(SProduct.getProducts());
    if (error) {
      res.status(400);
      return res.render("error/400");
    }
    return res.render("default/product", {
      page: "product",
      products: products,
      user: user,
      breadcrumb: "all product",
      sort: null,
      category: null,
      categories: categories,
      searchCounts: null,
      search: null,
    });
  } else if (query.sort) {
    const [error, products] = await to(SProduct.filterSortProduct(query.sort));
    if (error) {
      res.status(400);
      return res.render("error/400");
    }
    return res.render("default/product", {
      page: "product",
      products: products,
      user: user,
      breadcrumb: "all product",
      sort: query.sort,
      category: null,
      searchCounts: null,
      search: null,
      categories: categories,
    });
  } else if (query.category) {
    const [error, products] = await to(SProduct.filterCategory(query.category));
    const category = await Category.findById(query.category);
    console.log(category);
    const categoryName = category._doc.name;
    console.log(categoryName);
    if (error) {
      console.log(error);
      res.status(400);
      return res.render("error/400");
    }
    return res.render("default/product", {
      page: "product",
      products: products,
      user: user,
      breadcrumb: categoryName,
      sort: null,
      category: categoryName,
      searchCounts: null,
      categories: categories,
      search: null,
    });
  } else {
    const [error, products] = await to(SProduct.searchName(query.search));
    if (error) {
      res.status(400);
      return res.render("error/400");
    }
    return res.render("default/product", {
      page: "product",
      products: products,
      user: user,
      breadcrumb: "search",
      sort: null,
      category: null,
      searchCounts: products.length,
      categories: categories,
      search: query.search,
    });
  }
};
const getSingle = async (req, res, next) => {
  let user;
  if (req.user) {
    user = req.user;
  }
  const productId = req.params.id;
  const [error, product] = await to(SProduct.getProduct(productId));
  if (error) {
    res.status(400);
    return res.render("error/400");
  }
  return res.render("default/product/single", {
    page: "product",
    product: product._doc,
    user: user,
  });
};
const getCart = async (req, res, next) => {
  let user;
  if (req.user) {
    user = req.user;
  }
  return res.render("default/Cart", { user: user, page: "product" });
};
module.exports = { getIndex, getSingle, getCart };
