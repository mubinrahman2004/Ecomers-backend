const { responseHandler } = require("../services/responseHandler");

const roleCheckMiddleware =  (...roles) => {
  return (req, res, next) => {
    try {
      if (roles.includes(req.user.role)) {
        return next();
      }
      return responseHandler(res, 400, "invalid request");
    } catch (error) {
      return responseHandler(res, 500, "invalid request..");
    }
  };
};

module.exports = roleCheckMiddleware;
