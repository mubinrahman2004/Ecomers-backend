const productSchema = require("../models/productSchema");
const { responseHandler } = require("../services/responseHandler");

const addToCart = async (req, res) => {
  try {
    const { productId, sku, quantity } = req.body;

    if (!productId || !sku || !quantity)
      return responseHandler.error(res, 400, "invalid request");

    const productData = await productSchema.findById(productId);
    productData.variants;
    const existingCart = await cartSchema.find({
      user: req.user._id,
    });
    const discountAmount =
      (productData.price * productData.discountPercentage) / 100;
    const discountPrice = productData.price - discountAmount;

    const subtotal = discountPrice * quantity;
    if (existingCart) {
     const alreadyExist= existingCart.items.map((pItem) => pItem.sku == sku)
        if (alreadyExist)
          return responseHandler.error(
            res,
            400,
            "product already exixt in cart",
          );
    
      existingCart.item.push({
        product: productId,
        sku,
        quantity,
        subtotal,
      });
      existingCart.save();
      responseHandler.success(res, 201, "Product added to cart");
    }else{

        await cartSchema.create({
          user: req.user._id, 
          item: [
            {
              product: productData,
              sku,
              quantity,
              subtotal,
            },
          ],
        });
    }
  

    responseHandler.success(res, 201, "Product added to cart");
  } catch (error) {}
};
module.exports = addToCart;
