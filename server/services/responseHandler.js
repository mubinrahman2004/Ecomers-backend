// const responseHandler=(
//     res,statusCode=200,
//     message="",
//     success=false,
//     data=null
// )=>{
// return res.status(statusCode).json({
//     success,
//     message,
//     ...(data && {data})
// })
// }
// module.exports={responseHandler}
const responseHandler = {
  success: (res, statuscode = 200, data, message) => {
    return res.status(statuscode).json({
      success: true,
      message,
      data,
    });
  },
  error: (res, statusCode = 500, message) => {
    return res.status(statusCode).json({
      success: false,
      message: message || "Internal server error",
    });
  },
};
module.exports={responseHandler}