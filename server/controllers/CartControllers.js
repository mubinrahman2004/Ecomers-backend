const productSchema = require("../models/productSchema");
const isValidId = require("../services/isValidId");
const { responseHandler } = require("../services/responseHandler");

const addToCart = async (req, res) => {
  try {
    const { productId, sku, quantity } = req.body;

    if (!productId || !sku || !quantity)
      return responseHandler.error(res, 400, "invalid request");

    productData.variants;
    const existingCart = await cartSchema.find({
      user: req.user._id,
    });
    const productData = await productSchema.findById(productId);
    const discountAmount =
      (productData.price * productData.discountPercentage) / 100;
    const discountPrice = productData.price - discountAmount;

    const subtotal = discountPrice * quantity;
    if (existingCart) {
      const alreadyExist = existingCart.items.map((pItem) => pItem.sku == sku);
      if (alreadyExist)
        return responseHandler.error(res, 400, "product already exixt in cart");

      existingCart.item.push({
        product: productId,
        sku,
        quantity,
        subtotal,
      });
      existingCart.save();
      responseHandler.success(res, 201, "Product added to cart");
    } else {
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

const getUserCart = async (req, res) => {
  try {
    const cart = await cartSchema
      .findOne({ user: req.user._id })
      .select("-user");
    responseHandler.success(res, 200, {...cart,totalItems});
  } catch (error) {
    responseHandler.error(res, 500, "server error");
  }
};

const updateCart = async (req, res) => {
  try {
    const { productId, itemId, quentity } = req.body;
    if (!isValidId([productId, itemId]))
      return responseHandler.error(res, 400, "invalid request");

    if (quentity < 1)
      return responseHandler.error(res, 400, "Keep minimum 1 item");
    if (!itemId || !quentity || !productId)
      return responseHandler.error(res, 400, "invalid request");
    const productData = await productSchema.findById(productId);
    const discountAmount =
      (productData.price * productData.discountPercentage) / 100;
    const discountPrice = productData.price - discountAmount;

    const subtotal = discountPrice * quantity;

    const cart = await cartSchema
      .findOneAndUpdate(
        { user: req._id, "item._id": itemId },
        {
          $set: { "items.$.quantity": quantity, "items.$.subtotal": subtotal },
        },
        { new: true },
      )
      .select("items totalItems");
    responseHandler.success(res, 200, cart, "cart update ");
  } catch (error) {}
};

const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    if (!isValidId([productId, itemId]))
      return responseHandler.error(res, 400, "invalid request");

    if (!itemId) return responseHandler.error(res, 400, "invalid request");

    const cart = await cartSchema
      .findOneAndUpdate(
        { user: req._id, "item._id": itemId },
        { $pull: { items: { _id: itemId } } },
        { new: true },
      )
      .select("items totalItems");
    responseHandler.success(res, 200, cart, "cart update ");
  } catch (error) {}
};

module.exports = { addToCart, getUserCart, updateCart,removeFromCart };
