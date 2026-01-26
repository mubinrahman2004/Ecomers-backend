const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: "mubinrahman2003@gmail.com",
    pass: "ygqh nxik yfoz pody",
  },
});
const sendEmail=async({email,subject,otp,template})=>{


  await transporter.sendMail({
    from: '"Node_ecomers" <maddison53@ethereal.email>',
    to: email,
    subject:subject ,
    html:   template({otp }) , 
  });
}
module.exports={sendEmail} 
// app password tzuk fzna orfu srmi

