const { responseHandler } = require("../services/responseHandler")

const creatProduct=async(req,res)=>{
    try {
        const {title,
discription,
category,
price,
discountPercentage,
variants,
tags,

inActive}=req.body
if(!title) return responseHandler (res,400,"Product thumbnail is requred")
if(!discription) return responseHandler (res,400,"Product description is requred")
if(!category) return responseHandler (res,400,"Product category is requred")
if(!price) return responseHandler (res,400,"Product price is requred")
    } catch (error) {
        
    }
}
 
module.exports= {creatProduct}