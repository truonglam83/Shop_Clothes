const SCategory = require("../../models/services/category");
const { to } = require("await-to-js");
const getIndex = async (req, res, next) => {
  const [error, categories] = await to(SCategory.getCategoriesBaseInfo());
  if (error) {
    console.log(error);
    return res.send("error occur");
  }
  var Fcategories = categories.map((category) => {
    return { ...category, productsCount: category.products.length };
  });
  Fcategories = Fcategories.filter((category) => !category.isDeleted);
  return res.render("admin/category", {
    page: "category",
    categories: Fcategories,
  });
};
const getEdit = async (req, res, next) => {
  const [error, category] = await to(SCategory.getCategory(req.params.id));
  if (error) {
    console.log(error);
    return res.send("error occur");
  }
  return res.render("admin/category/edit", {
    page: "category",
    category: category,
  });
};
const getRemove = async (req, res, next) => {
  const cateid = req.params.id;
  const [error] = await to(SCategory.deleteCategories(cateid));
  if (error) {
    console.log(error);
    return res.send("error occur");
  }
  return res.redirect("/admin/category");
};
module.exports = { getIndex, getEdit, getRemove };
