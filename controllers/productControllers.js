const { pipeline } = require("nodemailer/lib/xoauth2");
const categorySchema = require("../models/categorySchema");
const productSchema = require("../models/productSchema");
const {
  uploadToCloudinary,
  delateFromCloidinary,
} = require("../services/cloudinaryService");
const { responseHandler } = require("../services/responseHandler");
const SIZE_ENUM = require("../services/utils");
const { json } = require("express");
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
    const search = req.query.search;
    const totalProducts = await productSchema.countDocuments();

    const pipeline = [
      {
        $match: {
          isActive: true,
        },
      },
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
          "category.slug": category,
        },
      });
    }
    if (search) {
      pipeline.push({
        $match: {
          title: {
            $regex: search,
            $options: "i", // 'i' for case-insensitive
          },
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

const getProductDeatails = async (req, res) => {
  try {
    const slug = req.params;
    const productdetails = await productSchema
      .findOne({ slug, isActive: true })
      .populate("category", "name")
      .select(" -updatedAt -_v");
    if (!productdetails)
      return responseHandler.error(res, 404, "product not found");

    return responseHandler(res, 200, "", true, productdetails);
  } catch (error) {
    return responseHandler(res, 500, "Internal server error");
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      title,

      discription,
      category,
      price,
      discountPercentage,
      variants,
      tags,
      isActive,
      destroyImages,
    } = req.body;
    const { slug } = req.params;
    const thumbnail = req.files?.thumbnail;
    const images = req.files?.images;
    const productData = await productSchema.findOne({ slug });

    if (title) productData.title = title;
    if (discription) productData.discription = discription;
    if (category) productData.category = category;
    if (discountPercentage) productData.discountPercentage = discountPercentage;

    if (price) productData.price = price;
    if (tags && tags?.length > 0 && Array.isArray(tags))
      productData.tags = tags;
    if (isActive) productData.isActive = isActive === "true";

    const variantsData = variants && JSON.parse(variants);
    if (!Array.isArray(variantsData) && variantsData.length === 0) {
      for (const variant of variantsData) {
        if (!variant.sku)
          return responseHandler.error(res, 400, "sku is required");
        if (!variant.color)
          return responseHandler.error(res, 400, "color is required");
        if (!variant.size)
          return responseHandler.error(res, 400, "size is required");
        if (!SIZE_ENUM.includes(variants.size))
          return responseHandler(res, 400, "invalid size");
        if (!variant.stock || variant.stock < 1)
          return responseHandler.error(
            res,
            400,
            "stock is required and must be more than 0",
          );
      }
      const skus = variantsData.map((v) => v.sku);
      if (new Set(skus).size !== skus.length)
        return responseHandler.error(res, 400, "sku must unique");
      productData.variants = variantsData;
    }
    if (thumbnail) {
      const imgPublickId = productData.thumbnail.split("/").pop().split(".")[0];
      delateFromCloidinary(`products/${imgPublickId}`);
      const imgRes = uploadToCloudinary(thumbnail, "products");
      productData.thumbnail = imgRes.secure_url;
    }
    let imagesUrl = [];
    let totalImages = productData.images.length;
    if (destroyImages.length > 0) totalImages -= destroyImages.length;
    if (Array.isArray(images) && images.length > 0)
      totalImages += images.length;
    if (totalImages > 4)
      return responseHandler.error(res, 400, "you can upload miximum 4 images");
    if (totalImages < 1)
      return responseHandler.error(res, 400, "minimum 1 images should be stay");
    if (images) {
      const resPromis = images.map(async (item) =>
        uploadToCloudinary(item, "product"),
      );
      const results = await Promise.all(resPromis);
      imagesUrl = results.map((r) => r.secure_url);
    }

    if (Array.isArray(destroyImages) && destroyImages.length > 0) {
      for (const url of destroyImages) {
        const imgPublickId = url.split("/").pop().split(".")[0];

        delateFromCloidinary(`products/${imgPublickId}`);
      }
      let filteredImage = productData.images.filter((item) => {
        return !destroyImages.includes(item);
      });
      allImagesUrl.concat(filteredImage);
    }
    if (imagesUrl.length > 0) productData.images = imagesUrl;

    productData.save();

    return responseHandler.success(
      res,
      200,
      productData,
      "product updated successfully",
    );
  } catch (error) {}
};

module.exports = {
  creatProduct,
  getProductList,
  getProductDeatails,
  updateProduct,
};
