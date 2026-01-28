 const express =require("express")
 const route =express.Router()
const authRouter=require("./auth")
const productRouter=require("./product")
route.use("/auth",authRouter);
route.use("/catagory",require("./catagory"));
// route.use("/product",productRouter);


route.get("/",(req,res)=>{
    res.send("from server")
})

 module.exports=route
 