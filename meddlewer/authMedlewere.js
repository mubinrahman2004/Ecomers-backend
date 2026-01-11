const { verifyToken } = require("../services/helpers");
const { responseHandler } = require("../services/responseHandler");

const authMeddleware = async (req, res, next) => {
  try {
    const token = req.cookies;
    console.log(token["XAS-TOKEN"]);
    if (!token["XAS-TOKEN"]) {
      return responseHandler(res, 400, "invalid request");
    }

    const decoded= verifyToken(token["XAS-TOKEN"])
  
    if(!decoded){
        return responseHandler(res, 400, "invalid request");
    }
    req.user=decoded
    next()
  } catch (error) {
    return responseHandler(res, 400, "invalid request");
  }
};
module.exports = {authMeddleware};
  