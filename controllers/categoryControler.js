const categorySchema = require("../models/categorySchema");
const { uploadToCloudinary } = require("../services/cloudinaryService");
const { responseHandler } = require("../services/responseHandler");

const createNewCatagory = async (req, res) => {
  try {
    const { name,slug, description } = req.body;
    if (!name) return responseHandler(res, 400, "catagory name is require");
    if (!slug) return responseHandler(res, 400, " slug is require");
    if (!req.file)
      return responseHandler(res, 400, "catagory thumnail is require");

    const existingSlug = await categorySchema.findOne({ slug });
    if (!existingSlug)
      return responseHandler(
        res,
        400,
        "catagory width  this slug already  exist",
      );

    const imgRes = uploadToCloudinary(req.file, "categories");

    const category = categorySchema({
      name,
      slug,
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
