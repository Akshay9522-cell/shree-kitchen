const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

/*
=================================
DASHBOARD STATS
=================================
*/
exports.getDashboardStats = async (
  req,
  res
) => {
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

    const revenueResult =
      await Order.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0]
            .totalRevenue
        : 0;

    res.status(200).json({
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

/*
=================================
SALES ANALYTICS
=================================
*/
exports.getSalesAnalytics =
  async (req, res) => {
    try {
      const sales =
        await Order.aggregate([
          {
            $match: {
              paymentStatus:
                "Paid",
            },
          },

          {
            $group: {
              _id: {
                month: {
                  $month:
                    "$createdAt",
                },
              },

              revenue: {
                $sum:
                  "$totalAmount",
              },
            },
          },

          {
            $sort: {
              "_id.month": 1,
            },
          },
        ]);

      const months = [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const formattedSales =
        sales.map((item) => ({
          month:
            months[
              item._id.month
            ],
          revenue:
            item.revenue,
        }));

      res.status(200).json({
        success: true,
        sales:
          formattedSales,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

  exports.getRecentOrders = async (
  req,
  res
) => {
  try {

    const orders =
      await Order.find()
        .populate(
          "user",
          "name email"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5);

    res.json({
      success: true,
      orders,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

exports.getTopProducts = async (
  req,
  res
) => {
  try {

    const topProducts =
      await Order.aggregate([
        {
          $unwind: "$items"
        },

        {
          $group: {
            _id:
              "$items.product",

            totalSold: {
              $sum:
                "$items.quantity"
            }
          }
        },

        {
          $sort: {
            totalSold: -1
          }
        },

        {
          $limit: 5
        },

        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product"
          }
        },

        {
          $unwind: "$product"
        }
      ]);

    res.json({
      success: true,
      topProducts
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.getLowStockProducts = async (
  req,
  res
) => {
  try {

    const products =
      await Product.find({
        stock: {
          $lte: 5
        },
        isActive: true
      })
      .sort({
        stock: 1
      });

    res.json({
      success: true,
      products
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};