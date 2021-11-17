const Router = require("express").Router();
const SProduct = require("../models/services/product");
const formidable = require("formidable");
const { to } = require("await-to-js");
const uploadImage = require("../models/services/uploadImage");
Router.route("/")
  .get(async (req, res) => {
    const products = await SProduct.getProducts();
    return res.json(products);
  })
  .post(async (req, res) => {
    const form = formidable.IncomingForm();
    const fieldObject = {};
    const fileArray = [];
    form.on("field", (field, value) => {
      fieldObject[field] = value;
    });
    form.on("file", (field, file) => {
      fileArray.push(file);
    });
    await form.parse(req, async (err, fields, files) => {
      if (err) return res.json(err);
      const imgSrcs = [];
      for (const file of fileArray) {
        if (file.size > 0) {
          const [err, imgUrl] = await to(uploadImage(file.path));
          if (err) console.log(err);
          imgSrcs.push(imgUrl);
        }
      }
      const [error] = await to(
        SProduct.addProduct(
          fieldObject.name,
          fieldObject.price,
          imgSrcs,
          fieldObject.category,
          fieldObject.description
        )
      );
      if (error) {
        console.log(error);
        res.status(400);
        return res.end("done");
      }
      return res.json({ ...fieldObject, imgSrcs });
    });
  });
Router.route("/:id").put(async (req, res) => {
  const form = formidable.IncomingForm();
  const fieldObject = {};
  const fileArray = [];
  form.on("field", (field, value) => {
    fieldObject[field] = value;
  });
  form.on("file", (field, file) => {
    fileArray.push(file);
  });
  await form.parse(req, async (err, fields, files) => {
    if (err) return res.json(err);
    const imgSrcs = [];
    for (const file of fileArray) {
      if (file.size > 0) {
        const [err, imgUrl] = await to(uploadImage(file.path));
        if (err) console.log(err);
        imgSrcs.push(imgUrl);
      }
    }
    const [error] = await to(
      SProduct.updateProduct(req.params.id, {
        name: fieldObject.name,
        price: fieldObject.price,
        category: fieldObject.category,
        description: fieldObject.description,
      })
    );
    if (error) {
      console.log(error);
      res.status(400);
      return res.end("done");
    }
    return res.json({ ...fieldObject, imgSrcs });
  });
});
module.exports = Router;
