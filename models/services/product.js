const ProductModel = require("../Product");
const { to } = require("await-to-js");
const ObjectId = require("mongoose").mongo.ObjectID;
const getProducts = async () => {
  const [error, products] = await to(
    ProductModel.find({ isDeleted: false }).populate("category")
  );
  if (error) {
    console.log(error);
  }
  return products;
};
const getProduct = async (PId) => {
  rPId = ObjectId(PId);
  const [error, product] = await to(
    ProductModel.findById(PId).populate("category")
  );
  if (error) {
    console.log(error);
  }
  return { ...product };
};
const updateProduct = async (productId, data) => {
  const id = ObjectId(productId);
  const [error] = await to(ProductModel.findByIdAndUpdate(id, data));
  if (error) console.log(error);
  return;
};
const newProduct = async (name, price, images, category, description) => {
  console.log(category);
  category = ObjectId(category);
  const newProduct = new ProductModel({
    name,
    price,
    images,
    category,
    description,
  });
  console.log(newProduct);
  const [error] = await to(newProduct.save());
  if (error) console.log(error);
  return;
};
const deleteProduct = async (productId) => {
  const [error] = await to(
    ProductModel.findByIdAndUpdate(productId, { isDeleted: true })
  );
  if (error) console.log(error);
};
const filterSortProduct = async (filter) => {
  if (filter == 1) {
    const [error, products] = await to(
      ProductModel.find().populate("category").sort("category.name")
    );
    if (error) {
      console.log(error);
    }
    return products;
  } else if (filter == 2) {
    const [error, products] = await to(
      ProductModel.find()
        .populate("category")
        .sort([["price", 1]])
    );
    if (error) {
      console.log(error);
    }
    return products;
  } else {
    const [error, products] = await to(
      ProductModel.find()
        .populate("category")
        .sort([["price", -1]])
    );
    if (error) {
      console.log(error);
    }
    return products;
  }
};
const filterCategory = async (category) => {
  category = ObjectId(category);
  const [error, products] = await to(
    ProductModel.find({ category: category }).populate("category")
  );
  if (error) console.log(error);
  return products;
};
const searchName = async (search) => {
  const regEx = new RegExp(search, "i");
  console.log(regEx);
  const [error, products] = await to(
    ProductModel.find({ name: { $regex: regEx } }).populate("category")
  );
  if (error) console.log(error);
  return products;
};

module.exports = {
  getProducts,
  getProduct,
  updateProduct,
  addProduct: newProduct,
  deleteProduct,
  filterSortProduct,
  filterCategory,
  searchName,
};
