const OrderSchma = require("../models/OrderSchma");
const { responseHandler } = require("../services/responseHandler");

const checkout = async (req, res) => {
  const { paymentType, cartId, shippingAddress, insideDhaka } = req.body;
  const orderNumber = `TRX-${Date.now()}`;

  if(!paymentType|| !cartId || !shippingAddress || !insideDhaka){
    responseHandler.error(res,400,"all field are requre")
  }
   
  try {
    if (!cartId) return responseHandler.error(res, 400, "invalid request");
    const cartData = await categorySchema.findOne({ _id: cartId });
    if (!cartData) return responseHandler.error(res, 400, "invalid request");

    const charge = insideDhaka === "true" ? 80 : 120;
    const totalPrice = cartData.items.reduce((total, current) => {
      return (total += current.subtotal);
    }, charge);

    const orderData = new OrderSchma({
      user: req.user._id,
      item: cartData.items,
      shippingAddress,
      insideDhaka,
      delivaryCharge: charge,
      totalPrice,
      payment: {
        method: paymentType,
      },
      orderNumber,
    });
    orderData.save()
if(paymentType==="cash"){
return responseHandler.success(res,200,"order place successfully")
}

  } catch (error) {}
};
module.exports = checkout;
