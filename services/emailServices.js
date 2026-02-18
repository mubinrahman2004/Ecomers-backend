const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: "mubinrahman2003@gmail.com",
    pass: "afsx netr czuw ktri",
  },
});
const sendEmail=async({email,subject,otp,template})=>{


  await transporter.sendMail({
   from: '"Node_ecomers" <mubinrahman2003@gmail.com>',
  //  emailisvarifiedtoken and top related product and related produr
    to: email,
    subject:subject ,
    html:   template({otp }) , 
  });
} 
module.exports={sendEmail} 
// app password afsx netr czuw ktri


 