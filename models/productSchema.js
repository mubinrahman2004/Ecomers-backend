const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  discription: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "category",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPercentage: {
    type: String,
    default: 0,
  },
  variants: [
    {
      sku: {
        type: String,
        required: true,
        unique: true,
      },
      attributes: {
        color: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          required: true,
          enum: ["s", "m", "l", "xl", "2xl", "3xl"],
        },
        strock: {
          type: String,
          required: true,
        },
      },
    },
  ],

  tags: {
    type: Array,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  image: {
    type: Array,
  },
  inActive:{
    type:Boolean,
    default:false
  }
},{timestamps:true});
module.exports = mongoose.model("product", productSchema);
