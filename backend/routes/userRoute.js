const express =
  require("express");

const router =
  express.Router();

const {
  getUserDashboard,getProfile,updateProfile,changePassword
} = require(
  "../controllers/userController"
);

const {
  protect,
} = require(
  "../middlewares/authMiddleware"
);

router.get(
  "/dashboard",
  protect,
  getUserDashboard
);

router.get(
  "/profile",
  protect,
  getProfile
);

router.put(
  "/profile",
  protect,
  updateProfile
);
router.put(
  "/change-password",
  protect,
  changePassword
);

module.exports = router;