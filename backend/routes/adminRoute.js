const express = require("express");
const router = express.Router();
const { getDashboardStats,getSalesAnalytics,getRecentOrders,getTopProducts } = require("../controllers/adminController");
const {
  protect,
} = require("../middlewares/authMiddleware");

const {
  authorize,
} = require("../middlewares/roleMiddleware");

router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  getDashboardStats
);
router.get(
  "/stats",
  protect,
  authorize("admin"),
  getDashboardStats
);
router.get(
  "/analytics",
  protect,
  authorize("admin"),
  getSalesAnalytics
);

router.get(
  "/recent-orders",
  protect,
  authorize("admin"),
  getRecentOrders
);

router.get(
  "/top-products",
  protect,
  authorize("admin"),
  getTopProducts
);
module.exports = router;