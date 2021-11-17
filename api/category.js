const express = require("express");
const Router = express.Router();
const SCollection = require("../models/services/category");
const { to } = require("await-to-js");
const formidable = require("formidable");
const uploadImg = require("../models/services/uploadImage");
const mongoose = require("mongoose");
Router.route("/")
  .get(async (req, res) => {
    let [err, categories] = await to(SCollection.getCategories());
    if (err) return res.json(err);
    return res.json(categories);
  })
  .post(async (req, res) => {
    const form = formidable({ multiple: true });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log("parsing form error");
        return;
      }
      if (files.thumbnailImg && files.thumbnailImg.size > 0) {
        var [error, imgUrl] = await to(uploadImg(files.thumbnailImg.path));
        if (error) {
          console.log("Image server error", error);
          return res.json({ error: "img server error" });
        }
        const { name, description, thumbnailImg } = {
          ...fields,
          thumbnailImg: imgUrl,
        };
        let [savingErr] = await to(
          SCollection.newCategory(name, description, thumbnailImg)
        );
        if (savingErr) return res.json({ savingErr, log: "saving error" });
        return res.json({ log: "success" });
      } else {
        return res.json({ error: "missing fields" });
      }
    });
  });
Router.route("/:id")
  .get(async (req, res) => {
    const cateId = req.params.id;
    let [err, category] = await to(SCollection.getCategory(cateId));
    if (err) return res.json(error);
    return res.json(category);
  })
  .put(async (req, res) => {
    const cateId = mongoose.mongo.ObjectID(req.params.id);
    const form = formidable({ multiple: true });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log("parsing form error");
        return;
      }
      if (files.thumbnailImg && files.thumbnailImg.size > 0) {
        var [error, imgUrl] = await to(uploadImg(files.thumbnailImg.path));
        if (error) {
          console.log("Image server error", error);
          return res.json({ error: "img server error" });
        }
        const { name, description, thumbnailImg } = {
          ...fields,
          thumbnailImg: imgUrl,
        };
        let [savingErr] = await to(
          SCollection.updateCategory(cateId, {
            name,
            description,
            thumbnailImg,
          })
        );
        if (savingErr) return res.json({ savingErr, log: "saving error" });
        return res.json({ log: "success" });
      } else {
        const updateData = { ...fields };
        let [error] = await to(SCollection.updateCategory(cateId, updateData));
        if (error) return res.json({ error });
        return res.json({ log: "success" });
      }
    });
  })
  .delete(async (req, res) => {
    const cateId = req.params.id;
    const [err] = await to(SCollection.deleteCategory(cateId));
    if (err) return res.json({ log: "error" });
    return res.json({ log: "success" });
  });
module.exports = Router;
