 const express =require("express")
const checkout = require("../controllers/orderControllers")

 const route =express.Router()
route.post("/checkout",checkout)

 
 module.exports=route