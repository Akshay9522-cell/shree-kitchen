const Order = require("../models/Order");
const User = require("../models/User"); 
const bcrypt = require("bcryptjs");

exports.getUserDashboard = async (req, res) => {
  try {
    // 1. Fetch all orders to calculate metrics
    const orders = await Order.find({ user: req.user._id });

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
      (o) => o.orderStatus === "Pending"
    ).length;

    const deliveredOrders = orders.filter(
      (o) => o.orderStatus === "Delivered"
    ).length;

    const totalSpent = orders.reduce(
      (acc, order) => acc + order.totalAmount,
      0
    );

    // 2. Fetch only the 5 most recent orders
    const recentOrders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    // 3. Send everything back in a single response
    return res.json({
      success: true,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalSpent,
      recentOrders,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProfile =
async (req, res) => {

  try {

    const user =
      await User.findById(
        req.user._id
      ).select("-password");

    res.json({
      success: true,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

exports.updateProfile =
async (req, res) => {

  try {

    const user =
      await User.findById(
        req.user._id
      );

    user.name =
      req.body.name ||
      user.name;

    user.phone =
      req.body.phone ||
      user.phone;

    user.address =
      req.body.address ||
      user.address;

    await user.save();

    res.json({
      success: true,
      message:
        "Profile updated successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

exports.changePassword =
  async (req, res) => {
    try {

      const {
        currentPassword,
        newPassword,
      } = req.body;

      const user =
        await User.findById(
          req.user._id
        );

      const isMatch =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message:
            "Current password is incorrect",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      user.password =
        hashedPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message:
          "Password changed successfully",
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };