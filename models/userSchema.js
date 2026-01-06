const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      default: "123",
    },
    address: {
      type: String,
    },
    distric: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "user"],
    },
    isverified: {
        type:Boolean,
        default:false
    },
    otp: {
      type: Number,
      default: null,
    },
    otpExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function () {
    const user=this;
  if (!this.isModified("password")) return;
try {
  user.password = await bcrypt.hash(user.password, 10); 
    
} catch (err) {
    
} 
});

userSchema.methods.comparePassword = async function (canddidatepassword) {
  return await bcrypt.compare(canddidatepassword, this.password);
};

module.exports=mongoose.model("user",userSchema)