const { JsonWebTokenError } = require("jsonwebtoken");
const userSchema = require("../models/userSchema");
const uploadToCloudinary = require("../services/cloudinaryService");
const { sendEmail } = require("../services/emailServices");
const {
  emailVerifyTemplate,
  resetPassEmailTem,
} = require("../services/emailTemplate");
const cloudinary = require("cloudinary").v2;

const {
  generateOTP,
  generatAccessToken,
  generatRefreshToken,
  generatResetPassToken,
  verifyResestToken,
  hashResetToken,
  verifyToken,
} = require("../services/helpers");
const { responseHandler } = require("../services/responseHandler");
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
    return responseHandler(
      res,
      200,
      "Registration successfull,please verified your email",
      true,
    );
  } catch (error) {
    return responseHandler(res, 500, "Internal server error");
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
    user.otpExpires = null;
    user.save();

    res.status(200).send({ Message: "verifie successfull" });
  } catch (error) {
    return responseHandler(res, 500, "Internal server error");
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

    if (!user) {
      return res.status(400).send({ message: "invalid request dd" });
    }
    const generatedOtp = generateOTP();
    user.otp = generateOTP();
    ((user.otpExpires = Date(Date.now() + 3 * 60 * 1000)),
      sendEmail({
        email,
        subject: "email verification",
        otp: generatedOtp,
        template: emailVerifyTemplate,
      }));

    res.status(201).send({
      message: "otp send to your email",
    });
  } catch (error) {
    return responseHandler(res, 500, "Internal server error");
  }
};

const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).send({ message: "email is required" });
    if (!isValidEmail(email))
      return res.status(400).send({ message: "Enter a valid email" });
    if (!password)
      return res.status(400).send({ message: "password is required" });
    const existingUser = await userSchema.findOne({ email });
    if (!existingUser)
      return res.status(400).send({ message: "Email is not verified" });

    const matchpass = await existingUser.comparePassword(password);
    if (!matchpass) {
      return res.status(400).send({ message: "wrong password" });
    }

    if (!existingUser.isVerified)
      return responseHandler(res, 400, "Email is not verified");
    const accessToken = generatAccessToken(existingUser);
    const refestoken = generatRefreshToken(existingUser);

    res.cookie("XAS-TOKEN", accessToken, {
      httpOnly: false,
      secure: false,
      maxAge: 3600000,
      // sameSite:"strict"
    });
    res.cookie("REF-TOKEN", refestoken, {
      httpOnly: false,
      secure: false,
      maxAge: 1296000000,
      // sameSite:"strict"
    });

    res.status(200).send({ message: "login successfull" });
  } catch (error) {
    return responseHandler(res, 500, "Internal server error");
  }
};

const forgetPass = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).send({ message: "email is required" });
    if (!isValidEmail(email))
      return res.status(400).send({ message: "Enter a valid email" });
    const existingUser = await userSchema.findOne({ email });
    if (!existingUser)
      return res.status(400).send({ message: "Email is not verified" });

    const { resetToken, hashedToken } = generatResetPassToken();
    existingUser.resetPassToken = hashedToken;
    existingUser.resetExpire = Date.now() + 3 * 60 * 1000;
    existingUser.save();
    const RESET_PASSWORD_LINK = `${process.env.CLIENT_URL || "http://localhost:3000"}/auth/resetpass?sec=${resetToken}`;
    sendEmail({
      email,
      subject: "Reset your password",
      otp: RESET_PASSWORD_LINK,
      template: resetPassEmailTem,
    });
    responseHandler(res, 200, "Find the  reset Password link in your email ");
  } catch (error) {
    return responseHandler(res, 500, "Internal server error");
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { token } = req.params;
    if (!newPassword)
      return responseHandler(res, 400, "new password is requred");
    if (!token) return responseHandler(res, 404, "page not found");

    const hashedToken = hashResetToken(token);
    const existingUser = await userSchema.findOne({
      resetPassToken: hashedToken,
      resetExpire: { $gt: Date.now() },
    });
    if (!existingUser) return responseHandler(res, 400, "Invelid Request");
    existingUser.password = newPassword;
    existingUser.resetPassword = "indifined";
    existingUser.resetExpire = undefined;
    existingUser.save();
    responseHandler(res, 200, "password update successfully");
  } catch (error) {
    return responseHandler(res, 500, "Internal server error");
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userProfile = await userSchema.findById(req.user._id).select("-password -otp  -otpExpires -resetPassToken ");
    if (!userProfile) return responseHandler(res, 200, " ", true, userProfile);
  } catch (error) {
    return responseHandler(res, 500, "Invalid server error");
  }
};
const updateUserProfile = async (req, res) => {
  try {
    const { avatar, fullName, phone, address } = req.body;
    const userId = req.user._id;
    const updateField = {};

    const user = await userSchema
      .findById(userId)
      .select("-password -otp  -otpExpires -resetPassToken ");
    if (avatar) {
      const imgPublickId = user.avatar.split("/").pop().split(".")[0];
      delateFromCloidinary(`avatar/${imgPublickId}`);
      const imgRes = uploadToCloudinary(avatar, "avatar");
      updateField.avater = imgRes.secure_url;
    }
    if (fullName) user.fullName = fullName;
    if (password) user.password = password;
    if (address) user.address = address;
    user.save();

    responseHandler(res, 201, "", user);
  } catch (error) {}
};

const refreshaccessToken = async () => {
  try {
    const refreshToken = req.cookie?.["REF-TOKEN"] || req.headers.authorization;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing " });
    }

    const decoded = verifyToken(refreshToken);
    if (!decoded) return;
    const accessToken = generatAccessToken(decoded);
    res
      .cookie("XAS-TOKEN", accessToken, {
        httpOnly: false,
        secure: false,
        maxAge: 3600000,
      })
      .send({ success: true });
  } catch (error) {
    console.error("resfresh token error");
  }
};

module.exports = {
  signupUser,
  verifyOtp,
  resendOTP,
  signInUser,
  forgetPass,
  getUserProfile,
  resetPassword,
  updateUserProfile,
};
