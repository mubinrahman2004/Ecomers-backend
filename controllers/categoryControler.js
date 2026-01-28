const categorySchema = require("../models/categorySchema");
const { uploadToCloudinary } = require("../services/cloudinaryService");
const { responseHandler } = require("../services/responseHandler");

const createNewCatagory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return responseHandler(res, 400, "catagory name is require");
    if (!req.file)
      return responseHandler(res, 400, "catagory thumnail is require");

    const existingName = await categorySchema.findOne({ name });
    if (!existingName)
      return responseHandler(
        res,
        400,
        "catagory width this  name already  exist",
      );

    const imgRes = uploadToCloudinary(req.file, "categories");

    const category = categorySchema({
      name,
      description,
      thumbnail: imgRes.secure_url,
    });
    category.save();
    responseHandler(res, 201, true, "", category);
  } catch (error) {
    return responseHandler(res, 500, "internal server error");
  }
};


const getAllCategories=async(req,res)=>{
try {
    const categories=await categorySchema.find({})
    responseHandler(res,200,true,"",categories)
} catch (error) {
    return responseHandler(res,500,"internal server eroor")
}
}



module.exports = { createNewCatagory,getAllCategories};
