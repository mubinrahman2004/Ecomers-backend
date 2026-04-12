const OrderSchma = require("../models/OrderSchma");
const { responseHandler } = require("../services/responseHandler");
const stripe = require("stripe")(`${process.env.STRIPE_SEC_KEY}`);
const endpointSecret = "whsec_qzLMAIsnn5csGumpcJyw6dURD56HbxD4";

const checkout = async (req, res) => {
  const { paymentType, cartId, shippingAddress, insideDhaka } = req.body;
  const orderNumber = `TRX-${Date.now()}`;

  if (!paymentType || !cartId || !shippingAddress || !insideDhaka) {
    responseHandler.error(res, 400, "all field are requre");
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
    orderData.save();

    if (paymentType === "cash") {
      return responseHandler.success(res, 200, "order place successfully");
    }
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "T-Shirt",
              description: `Blue T-Shirt with chest print`,
            },
            unit_amount: 500 * 100,
          },
          quantity: 1,
        },
      ],
      customer_email: `${req.user.email}`,

      metaData:{
        orderId:orderData._id
      },
      success_url: `${process.env.CLIENT_URL}success`,
      cancel_url: `${process.env.CLIENT_URL}error`,
    });
  } catch (error) {}
};

const webhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      endpointSecret,
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  console.log(event.type);

  if (event.type === "checkout.session.completed") {
    const session=event.data.object
    // Saving the payment details in the database
  const orderData = OrderSchma.findByIdAndUpdate(session.metaData.orderId,{"payment.status":"paid"})
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
};
module.exports = { checkout, webhook };
