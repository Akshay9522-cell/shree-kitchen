const express = require("express");

const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
} = require("../controllers/orderController");

const {
  protect,
} = require("../middlewares/authMiddleware");

const {
  authorize,
} = require("../middlewares/roleMiddleware");

// Customer
router.post("/", protect, placeOrder);

router.get(
  "/my-orders",
  protect,
  getMyOrders
);

// Admin
router.get(
  "/",
  protect,
  authorize("admin"),
  getAllOrders
);

module.exports = router;