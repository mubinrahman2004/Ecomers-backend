 const express =require("express")
const { addToCart, getUserCart, updateCart, removeFromCart } = require("../controllers/CartControllers")

 const route =express.Router()
route.post("/add",addToCart)
route.get("/get",getUserCart)  
route.put("/update",updateCart)
route.put("/remove",removeFromCart)

 
 module.exports=route