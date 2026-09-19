import paymentModel from "../models/payment.model.js";
import userModel from "../models/user.model.js";
import razorpay from "../services/razorpay.service.js";
import crypto from "crypto";

// SOURCE OF TRUTH for what each plan costs and gives. The browser only sends
// a planId; it must never decide the price or the credits, otherwise anyone
// could pay Rs 1 and receive 1,00,000 credits. Keep in sync with the
// numbers shown on client/src/Pages/Pricing.jsx.
const PLANS = {
  basic: { amount: 100, credits: 150 },
  pro: { amount: 500, credits: 650 },
};

export const createOrder = async (req, res) => {
  try {
    const { planId } = req.body;

    if (typeof planId !== "string" || !Object.hasOwn(PLANS, planId)) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const { amount, credits } = PLANS[planId];

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await paymentModel.create({
      userId: req.userId,
      planId,
      amount,
      credits,
      razorpayOrderId: order.id,
      status: "created",
    });

    return res.json(order);
  } catch (error) {
    return res.status(500).json({
      message: `Failed to create Razorpay order ${error}`,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedsignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedsignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const payment = await paymentModel.findOne({
      razorpayOrderId: razorpay_order_id,
    });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    if (payment.status === "paid") {
      return res.status(200).json({ message: "Already processed" });
    }

    ((payment.status = "paid"),
      (payment.razorpayPaymentId = razorpay_payment_id));
    await payment.save();

    const updatedUser = await userModel.findByIdAndUpdate(
      payment.userId,
      {
        $inc: { credits: payment.credits },
      },
      { new: true },
    );

    res.json({
      success: true,
      message: "Payment verified and credits added",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to verify Razorpay payment ${error}`,
    });
  }
};