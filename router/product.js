const express = require("express");
const authMeddleware = require("../meddlewer/authMedlewere");
const roleCheckMiddleware = require("../meddlewer/roleCheckMiddleware");
const { creatProduct, getProductList, getProductDeatails, updateProduct } = require("../controllers/productControllers");
const multer = require("multer");
const route = express.Router();
const upload = multer();

route.post(
  "/upload",
  authMeddleware,
  roleCheckMiddleware("admin", "editor"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "image", maxCount: 4 },
  ]),
  creatProduct,
);
route.get("/allproduct ",getProductList)
route.get("/:slug",getProductDeatails)
route.put("/update",authMeddleware,  roleCheckMiddleware("admin"),  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "image", maxCount: 4 },
  ]),updateProduct)
module.exports = route;
