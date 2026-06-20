const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

exports.getDashboardStats =
  async (req, res) => {
    try {

      const totalProducts =
        await Product.countDocuments({
          isActive: true,
        });

      const totalOrders =
        await Order.countDocuments();

      const totalUsers =
        await User.countDocuments({
          role: "customer",
        });

      const pendingOrders =
        await Order.countDocuments({
          orderStatus: "Pending",
        });

      const revenueData =
        await Order.find({
          paymentStatus: "Paid",
        });

      const totalRevenue =
        revenueData.reduce(
          (acc, order) =>
            acc + order.totalAmount,
          0
        );

      res.json({
        success: true,
        totalProducts,
        totalOrders,
        totalUsers,
        pendingOrders,
        totalRevenue,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };