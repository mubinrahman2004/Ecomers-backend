const userSchema = require("../models/userSchema");
const uploadToCloudinary = require("../services/cloudinaryService");
const { sendEmail } = require("../services/emailServices");
const {
  emailVerifyTemplate,
  resetPassEmailTem,
} = require("../services/emailTemplate");

const {
  generateOTP,
  generatAccessToken,
  generatRefreshToken,
  generatResetPassToken,
  hashResetToken,
  verifyToken,
} = require("../services/helpers");

const { responseHandler } = require("../services/responseHandler");
const isValidEmail = require("../services/validation");


// ================= SIGNUP =================
const signupUser = async (req, res) => {
  try {
    const { fullName, email, password, phone, address } = req.body;

    if (!email) return responseHandler.error(res, 400, "email is required");

    if (!isValidEmail(email))
      return responseHandler.error(res, 400, "Enter a valid email");

    if (!password)
      return responseHandler.error(res, 400, "password is required");

    const existingUser = await userSchema.findOne({ email });

    if (existingUser)
      return responseHandler.error(res, 400, "User already exists");

    const generatedOtp = generateOTP();

    const user = new userSchema({
      fullName,
      email,
      password,
      phone,
      address,
      otp: generatedOtp,
      otpExpires: Date.now() + 3 * 60 * 1000,
    });

    await user.save();

    await sendEmail({
      email,
      subject: "Email Verification",
      otp: generatedOtp,
      template: emailVerifyTemplate,
    });

    return responseHandler.success(
      res,
      200,
      null,
      "Registration successful, verify your email"
    );
  } catch (error) {
    return responseHandler.error(res, 500);
  }
};


// ================= VERIFY OTP =================
const verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp) return responseHandler.error(res, 400, "OTP is required");
    if (!email) return responseHandler.error(res, 400, "Invalid request");

    const user = await userSchema.findOne({
      email,
      otp: Number(otp),
      otpExpires: { $gt: new Date() },
      isverified: false,
    });

    if (!user)
      return responseHandler.error(res, 400, "Invalid or expired OTP");

    user.isverified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    return responseHandler.success(res, 200, null, "Verification successful");
  } catch (error) {
    return responseHandler.error(res, 500);
  }
};


// ================= RESEND OTP =================
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return responseHandler.error(res, 400, "Email required");

    const user = await userSchema.findOne({
      email,
      isverified: false,
    });

    if (!user)
      return responseHandler.error(res, 400, "Invalid request");

    const generatedOtp = generateOTP();

    user.otp = generatedOtp;
    user.otpExpires = Date.now() + 3 * 60 * 1000;

    await user.save();

    await sendEmail({
      email,
      subject: "Email Verification",
      otp: generatedOtp,
      template: emailVerifyTemplate,
    });

    return responseHandler.success(res, 200, null, "OTP sent");
  } catch (error) {
    return responseHandler.error(res, 500);
  }
};


// ================= SIGN IN =================
const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) return responseHandler.error(res, 400, "email required");

    if (!isValidEmail(email))
      return responseHandler.error(res, 400, "Invalid email");

    if (!password)
      return responseHandler.error(res, 400, "password required");

    const user = await userSchema.findOne({ email });

    if (!user)
      return responseHandler.error(res, 400, "User not found");

    if (!user.isverified)
      return responseHandler.error(res, 400, "Email not verified");

    const match = await user.comparePassword(password);

    if (!match)
      return responseHandler.error(res, 400, "Wrong password");

    const accessToken = generatAccessToken(user);
    const refreshToken = generatRefreshToken(user);

    res.cookie("XAS-TOKEN", accessToken, {
      httpOnly: false,
      secure: false,
      maxAge: 3600000,
    });

    res.cookie("REF-TOKEN", refreshToken, {
      httpOnly: false,
      secure: false,
      maxAge: 1296000000,
    });

    return responseHandler.success(res, 200, null, "Login successful");
  } catch (error) {
    return responseHandler.error(res, 500);
  }
};


// ================= FORGET PASSWORD =================
const forgetPass = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return responseHandler.error(res, 400, "Email required");

    const user = await userSchema.findOne({ email });

    if (!user)
      return responseHandler.error(res, 400, "User not found");

    const { resetToken, hashedToken } = generatResetPassToken();

    user.resetPassToken = hashedToken;
    user.resetExpire = Date.now() + 3 * 60 * 1000;

    await user.save();

    const link = `http://localhost:3000/auth/resetpass?sec=${resetToken}`;

    await sendEmail({
      email,
      subject: "Reset Password",
      otp: link,
      template: resetPassEmailTem,
    });

    return responseHandler.success(res, 200, null, "Reset link sent");
  } catch (error) {
    return responseHandler.error(res, 500);
  }
};


// ================= RESET PASSWORD =================
const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { token } = req.params;

    if (!newPassword)
      return responseHandler.error(res, 400, "New password required");

    const hashedToken = hashResetToken(token);

    const user = await userSchema.findOne({
      resetPassToken: hashedToken,
      resetExpire: { $gt: Date.now() },
    });

    if (!user)
      return responseHandler.error(res, 400, "Invalid request");

    user.password = newPassword;
    user.resetPassToken = undefined;
    user.resetExpire = undefined;

    await user.save();

    return responseHandler.success(res, 200, null, "Password updated");
  } catch (error) {
    return responseHandler.error(res, 500);
  }
};


// ================= PROFILE =================
const getUserProfile = async (req, res) => {
  try {
    const user = await userSchema
      .findById(req.user._id)
      .select("-password -otp -otpExpires -resetPassToken");

    if (!user)
      return responseHandler.error(res, 404, "User not found");

    return responseHandler.success(res, 200, user, "User profile");
  } catch (error) {
    return responseHandler.error(res, 500);
  }
};


// ================= UPDATE PROFILE =================
const updateUserProfile = async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;

    const user = await userSchema.findById(req.user._id);

    if (!user)
      return responseHandler.error(res, 404, "User not found");

    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    return responseHandler.success(res, 200, user, "Profile updated");
  } catch (error) {
    return responseHandler.error(res, 500);
  }
};


// ================= REFRESH TOKEN =================
const refreshaccessToken = async (req, res) => {
  try {
    const refreshToken =
      req.cookies?.["REF-TOKEN"] || req.headers.authorization;

    if (!refreshToken)
      return responseHandler.error(res, 401, "Token missing");

    const decoded = verifyToken(refreshToken);

    if (!decoded)
      return responseHandler.error(res, 401, "Invalid token");

    const accessToken = generatAccessToken(decoded);

    res.cookie("XAS-TOKEN", accessToken, {
      httpOnly: false,
      secure: false,
      maxAge: 3600000,
    });

    return responseHandler.success(res, 200, null, "Token refreshed");
  } catch (error) {
    return responseHandler.error(res, 500);
  }
};


module.exports = {
  signupUser,
  verifyOtp,
  resendOTP,
  signInUser,
  forgetPass,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  refreshaccessToken,
};