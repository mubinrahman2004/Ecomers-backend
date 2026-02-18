const { pipeline } = require("nodemailer/lib/xoauth2");
const categorySchema = require("../models/categorySchema");
const productSchema = require("../models/productSchema");
const { uploadToCloudinary } = require("../services/cloudinaryService");
const { responseHandler } = require("../services/responseHandler");
const SIZE_ENUM = ["s", "m", "l", "xl", "2xl", "3xl"];
const creatProduct = async (req, res) => {
  try {
    const {
      title,
      slug,
      discription,
      category,
      price,
      discountPercentage,
      variants,
      tags,

      inActive,
    } = req.body;
    const thumbnail = req.files?.thumbnail;
    const images = req.files?.images;

    if (!title)
      return responseHandler(res, 400, "Product thumbnail is requred");
    if (!slug) return responseHandler(res, 400, "slug is requred");
    const isslugExist = await productSchema.findOne({
      slug: slug.toLowerCase(),
    });
    if (!isslugExist) return responseHandler(res, 400, "slug already exist");

    if (!discription)
      return responseHandler(res, 400, "Product description is requred");
    if (!category)
      return responseHandler(res, 400, "Product category is requred");
    const iscategoryExist = await categorySchema.findById(category);
    if (!iscategoryExist) return responseHandler(res, 400, "invalid category");
    if (!price) return responseHandler(res, 400, "Product price is requred");

    if (!Array.isArray(variants) || variants.length === 0)
      return responseHandler(res, 400, "minimun 1 varient is required ");

    for (const variant of variants) {
      if (!variant.sku) return responseHandler(res, 400, "sku is required");
      if (!variant.color) return responseHandler(res, 400, "color is required");
      if (!SIZE_ENUM.includes(variants.size))
        return responseHandler(res, 400, "invalid size");
      if (!variant.stock || variant.stock < 1)
        return responseHandler(
          res,
          400,
          "stock is required and must be more than 0",
        );
    }
    const skus = variants.map((v) => v.sku);
    if (!thumbnail || thumbnail.length === 0)
      return responseHandler(res, 400, "product thumbnail is required");
    if (images && images.length > 4)
      return responseHandler(res, 400, "you can upload image max 4");
    const thumbnailUrl = uploadToCloudinary(thumbnail[0], "products");
    let imagesUrl = [];

    if (images) {
      const resPromis = images.map(async (item) => {
        return uploadToCloudinary(item, "product");
      });
      const results = await Promise.all(resPromis);
      imagesUrl = results.map((r) => r.secure_url);
    }
    if (new Set(skus).size !== skus.length)
      return responseHandler(res, 400, "sku must unique");

    const newProduct = new productSchema({
      title,
      slug: slug.toLowerCase(),
      discription,
      category,
      price,
      discountPercentage,
      variants,
      thumbnail: thumbnailUrl.secure_url,
      images: imagesUrl,
      tags,
      inActive,
    });
    newProduct.save();
    return responseHandler(res, 200, "product upload successfully");
  } catch (error) {
    return responseHandler(res, 500, "internal server error");
  }
};
const getProductList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page, default 1

    const limit = parseInt(req.query.limit) || 10; // Items per page, default 10
    const category = req.query.category;
    const skip = (page - 1) * limit; // Number of documents to skip

    const totalProducts = await Product.countDocuments();

    const pipeline = [
      {
        $lookup: {
          from: "products", // mongodb collection name
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $unwind: "$category",
      },

      {
        $sort: {
          createdAt: -1,
        },
      }, // sorting first (important)
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $count: "count",
      },
      {
        $project: {
          title,
          slug,
          discription,
          category,
          price,
          discountPercentage,
          variants,
          tags,
          thumbnail,
          image,
          inActive,
        },
      },
    ];
    if (category) {
      pipeline.push({
        $match: {
          "category.name": category,
        },
      });
    }

    const productList = await productSchema.aggregate(pipeline);

    const totalPages = Math.ceil(totalProducts / limit);
    responseHandler(res, 200, "", true, {
      products: productList,
      pagination: {
        total: totalProducts,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  creatProduct,
  getProductList,
};
