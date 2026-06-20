const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/adminController");
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

module.exports = router;