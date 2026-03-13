const { default: mongoose } = require("mongoose");

const isValidId = (ids) => {
  for (const id of ids) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return true;
    } else {
      return false;
    }
  }
};
module.exports=isValidId