

const  uploadToCloudinary=async(file,folder)=>{
    
const base64String =file.buffer.toString('base64');
const dataUri = `data:${req.file.mimetype};base64,${base64String}`;


   return  await cloudinary.uploader.upload(dataUri,{folder})
    
}
const delateFromCloidinary=async(publicId)=>{
const result=await cloudinary.uploader.destory(publicId)

}
module.exports={uploadToCloudinary,delateFromCloidinary}