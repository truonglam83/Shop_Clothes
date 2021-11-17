const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  thumbnailImg: { type: String },
  isDeleted: { type: Boolean, default: false },
});
const CategoryModel = mongoose.model("category", CategorySchema);
module.exports = CategoryModel;
