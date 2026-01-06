const userSchema = require("../models/userSchema");
const { sendEmail } = require("../services/emailServices");
const { emailVerifyTemplate } = require("../services/emailTemplate");
const { generateOTP } = require("../services/helpers");
const isValidEmail = require("../services/validation");

const signupUser = async (req, res) => {
  try {
    const { fullName, email, password, phone, address, distric, role } =
      req.body;

    if (!email) return res.status(400).send({ message: "email is required" });
    if (!isValidEmail(email))
      return res.status(400).send({ message: "Enter a valid email" });
    if (!password)
      return res.status(400).send({ message: "password is required" });

    const existingUser = await userSchema.findOne({ email });
    if (existingUser)
      return res.status(400).send({ message: "user already this email" });

    const generatedOtp = generateOTP();

    const user = new userSchema({
      fullName,
      email,
      password,
      phone,
      address,
      otp: generatedOtp,
      otpExpires: Date(Date.now() + 3 * 60 * 1000),
    });
    sendEmail({
      email,
      subject: "email verification",
      otp: generatedOtp,
      template: emailVerifyTemplate,
    });

    user.save();

    res.status(201).send({
      message: "Registration successfull,please verified your email ",
    });
  } catch (error) {
    res.status(500).send({ message: "server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp) return res.status(400).send({ message: "otp is requred" });
    if (!email) return res.status(400).send({ message: "invalid request" });

    const user = await userSchema.findOne({
      email,
      otp: Number(otp),
      otpExpires: { $gt: new Date() },
      isVerified: false,
    });

    if (!user) {
      return res.status(200).json({ Message: "invalid or experies opt" });
    }

    user.isVerified = true;
    user.otp = null;
    user.save();

    res.status(200).send({ Message: "verifie successfull" });
  } catch (error) {
    res.status(500).send({ message: "server error" });
  }
};
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).send({ message: "invalid request" });
    const user = await userSchema.findOne({
      email,
      isVerified: false,
    });

    if (!user){ 
      return res.status(400).send({ message: "invalid request dd" });}
    const generatedOtp = generateOTP();
    user.otp = generateOTP();
    (user.otpExpires = Date(Date.now() + 3 * 60 * 1000)),
      sendEmail({
        email,
        subject: "email verification",
        otp: generatedOtp,
        template: emailVerifyTemplate,
      });

    res.status(201).send({
      message: "otp send to your email",
    });
  } catch (error) {
    res.status(500).send({ message: "server error" });
  }
};

const signInUser=async (req, res) => {

  try {
    const {email,password}=req.body
      if (!email) return res.status(400).send({ message: "email is required" });
    if (!isValidEmail(email))
      return res.status(400).send({ message: "Enter a valid email" });
    if (!password)
      return res.status(400).send({ message: "password is required" });
 const existingUser = await userSchema.findOne({ email });
  if (!existingUser)
      return res.status(400).send({ message: "Email is not verified" });

const matchpass=await  existingUser.comparePassword(password)
  if(!matchpass){
      return res.status(400).send({ message: "wrong password" });
  }
    res.status(200).send({message:"login successfull"})
  } catch (error) {
    
  }
}


module.exports = { signupUser, verifyOtp, resendOTP,signInUser };
