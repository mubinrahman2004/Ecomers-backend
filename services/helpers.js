const jwt = require("jsonwebtoken");

function generateOTP() {
  return Math.floor(10000 + Math.random() * 90000);
}

// Example usage
// const otp = generateOTP();
// console.log(otp);

const generatAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },

    process.env.JWT_SEC,
    { expiresIn: "1h" }
  );
};

const generatRefreshToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SEC,
    { expiresIn: "12h" }
  );
};
const generatResetPassToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SEC,
    { expiresIn: "15d" }
  );
};
const verifyToken=(token)=>{
try {
  const decoded = jwt.verify(token, process.env.JWT_SEC);
  return decoded
} catch(err) { 
  
return null
}
}



module.exports = { generateOTP, generatAccessToken, generatRefreshToken,verifyToken,generatResetPassToken };
