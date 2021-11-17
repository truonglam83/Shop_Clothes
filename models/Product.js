const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  images: { type: Array },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
  description: { type: String },
  isDeleted: { type: Boolean, default: false },
});
const ProductModel = mongoose.model("product", ProductSchema);
module.exports = ProductModel;
