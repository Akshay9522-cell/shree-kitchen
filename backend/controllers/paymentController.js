require('dotenv').config();
const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Order = require("../models/Order");

exports.createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    console.log("Request Body:", req.body);

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await Order.findById(orderId);

    console.log("Order Found:", order);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Prevent duplicate payments
    if (order.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Order is already paid",
      });
    }

    const options = {
      amount: Math.round(order.totalAmount), // Convert ₹ to paise
      currency: "INR",
      receipt: `receipt_${order._id}`,
    };

    console.log("Razorpay Options:", options);

    const razorpayOrder = await razorpay.orders.create(options);

    console.log("Razorpay Order Created:", razorpayOrder);
    console.log("KEY ID:", process.env.RAZORPAY_KEY_ID);
    console.log("KEY SECRET:", process.env.RAZORPAY_KEY_SECRET);

    order.razorpayOrderId = razorpayOrder.id;
    order.paymentMethod = "ONLINE";

    await order.save();

    res.status(200).json({
      success: true,
      razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error("RAZORPAY CREATE ORDER ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
      error: error.error || error.description || null,
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.paymentStatus = "Paid";
    order.orderStatus = "Confirmed";
    order.razorpayPaymentId = razorpay_payment_id;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
    });

  } catch (error) {
    console.error("PAYMENT VERIFY ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};