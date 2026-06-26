const Order = require("../models/Order");
const Cart = require("../models/Cart");
const sendEmail = require("../services/emailService");
const User = require("../models/User"); // 🟢 FIXED: Changed 'user' to 'User'

exports.placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;

    const items = cart.items.map((item) => {
      totalAmount += item.product.price * item.quantity;

      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      };
    });

    // Shipping Charge
    if (totalAmount < 999) {
      totalAmount += 49;
    }

    // Create Order
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    // Get customer details
    const user = await User.findById(req.user._id);

    // Send email in background (doesn't delay API response)
    sendEmail({
      to: user.email,
      subject: "🎉 Order Placed Successfully | Shree Kitchen",
      html: `
        <div style="font-family:Arial,sans-serif;background:#f4f4f4;padding:30px;">
          <div style="max-width:650px;margin:auto;background:#fff;border-radius:10px;padding:30px;box-shadow:0 0 10px rgba(0,0,0,.1);">
            <h1 style="text-align:center;color:#2563eb;">🍽️ Shree Kitchen</h1>
            <h2>Hello ${user.name},</h2>
            <p>Thank you for shopping with <strong>Shree Kitchen</strong>.</p>
            <p>Your order has been placed successfully.</p>
            <hr>
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p><strong>Order Status:</strong> ${order.orderStatus}</p>
            <hr>
            <p>We will notify you when your order is confirmed and shipped.</p>
            <br>
            <p>Thank you ❤️</p>
            <h3>Team Shree Kitchen</h3>
          </div>
        </div>
      `,
    }).catch((err) => {
      console.error("Email Error:", err);
    });

    // Clear Cart
    cart.items = [];
    await cart.save();

    // Send Response
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateOrderStatus = async (
  req,
  res
) => {
  try {
    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus =
      req.body.orderStatus;

    await order.save();

    res.status(200).json({
      success: true,
      message:
        "Order updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};