const {
  json
} = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")

function generateOTP() {
  return Math.floor(10000 + Math.random() * 90000);
}

// Example usage
// const otp = generateOTP();
// console.log(otp);

const generatAccessToken = (user) => {
  return jwt.sign({
      _id: user._id,
      email: user.email,
      role: user.role,
    },

    process.env.JWT_SEC, {
      expiresIn: "1h"
    }
  );
};

const generatRefreshToken = (user) => {
  return jwt.sign({
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SEC, {
      expiresIn: "12h"
    }
  );
};
const generatResetPassToken = () => {
  const resetToken = crypto.ramdomBytes(16).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  return {
    resetToken,
    hashedToken
  }
};


const hashResetToken = (token) => {
  const hashedToken=crypto.createHash("sha256").update(token ).digest("hex")
  return hashedToken
}

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SEC);
    return decoded
  } catch (err) {

    return null
  }
}



module.exports = {
  generateOTP,
  generatAccessToken,
  generatRefreshToken,
  verifyToken,
  generatResetPassToken,
  hashResetToken
};