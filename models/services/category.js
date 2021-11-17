const CategoryModel = require("../Category");
const mongoose = require("mongoose");
const { to } = require("await-to-js");
const newCategory = async (name, description, thumbnailImg) => {
  const data = { name, description, thumbnailImg };
  const newCategory = new CategoryModel({ name, description, thumbnailImg });
  let [error] = await to(newCategory.save());
  if (error) console.log(error);
  return;
};
const updateCategory = async (cateId, data) => {
  const [error] = await to(
    CategoryModel.findOneAndUpdate({ _id: cateId }, data)
  );
  if (error) console.log(error);
  return;
};
const getCategories = async () => {
  let [err, categories] = await to(CategoryModel.find({ isDeleted: false }));
  if (err) throw new Error("error", err);
  return categories;
};
const getCategory = async (cateId) => {
  cateId = mongoose.mongo.ObjectID(cateId);
  const [err, category] = await to(CategoryModel.findById(cateId));
  if (err) console.log(err);
  return category;
};
const deleteCategories = async (cateId) => {
  const [error] = await to(
    CategoryModel.findOneAndUpdate({ _id: cateId }, { isDeleted: true })
  );
  if (error) console.log(error);
  return;
};
const getCategoriesBaseInfo = async () => {
  const categories = await CategoryModel.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "category",
        as: "products",
      },
    },
  ]);
  return categories;
};
module.exports = {
  newCategory,
  getCategories,
  updateCategory,
  deleteCategories,
  getCategory,
  getCategoriesBaseInfo,
};
