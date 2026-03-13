const mongoose = require("mongoose");

const orderItems = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },

  subtotal: {
    type: Number,
    required: true,
  },
});
const paymentSchema = new mongoose.Schema(
{
 
  method: {
    type: String,
    enum: ["COD", "Bkash", "Nagad", "Card", "Stripe", "cash"],
    required: true
  },

  PaymentId: {
    type: String
  },

status: {
    type: String,
    enum: ["Pending", "Success", "Failed", "Refunded"],
    default: "Pending"
  },

  paidAt: Date
  
}
);


const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true, // one active cart per user
    },

    items: [orderItems],

    shippingAddress: {
      type: string,
      required: true,
    },
    insideDhaka: {
      type: Boolean,
      required: true,
    },
    delivaryCharge: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    payment:paymentSchema,
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    orderNumber:{
        type:string,
        unique:true
    },
    delivaredAt:Date,
    
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", cartSchema);
