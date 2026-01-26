const cloudinary = require('cloudinary').v2;

const cloudinaryConfig=()=>{
cloudinary.config({ 
  cloud_name:process.env.CLOUDE_NAME, 
  api_key: process.env.CLOUDE_API_KEY, 
  api_secret: process.env.CLOUDE_API_SEC
});
}


module.exports=cloudinaryConfig