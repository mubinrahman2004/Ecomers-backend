const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
   sku:{
   type:String,
   required:true
   },
    
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    size: {
      type: String,
    },

    color: {
      type: String,
    },

    subtotal: {
      type: Number,
      required: true,
    },
  },
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true, // one active cart per user
    },

    items: [cartItemSchema],

    totalItems: {
      type: Number,
      default: 0,
    },

    totalPrice: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "ordered"],
      default: "active",
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Cart", cartSchema);