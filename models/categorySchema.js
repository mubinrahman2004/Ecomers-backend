const mongoose = require("mongoose");

const cetagorySchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
    trim: true,
  },
  thumbnail: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  isActive:{
    type:Boolean,
    default:true
  }
}); 
module.exports = mongoose.model("catagory",cetagorySchema);
