function generateOTP() {
  return Math.floor(10000 + Math.random() * 90000);
}

// Example usage
const otp = generateOTP();
console.log(otp);
module.exports={generateOTP} 
