const express = require("express");
const route = express.Router();

const authRouter = require("./auth");
const productRouter = require("./product");
const authMeddleware = require("../meddlewer/authMedlewere");
const order = require("./order");

route.get("/", (req, res) => {
    res.send("server running");
});

route.use("/auth", authRouter);
route.use("/product", productRouter);
route.use("/catagory", require("./catagory"));
route.use("/cart", authMeddleware, require("./cart"));
route.use(authMeddleware, order);



module.exports = route; 