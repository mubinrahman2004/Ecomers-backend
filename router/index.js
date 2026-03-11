 const express =require("express")
 const route =express.Router()
const authRouter=require("./auth")
const productRouter=require("./product");
const authMeddleware = require("../meddlewer/authMedlewere");

route.use("/auth",authRouter);
route.use("/product",productRouter)

route.use("/catagory",require("./catagory"));
route.use("/cart",authMeddleware, require("./cart"));



route.get("/",(req,res)=>{
    res.send("from server")
})

 module.exports=route
 