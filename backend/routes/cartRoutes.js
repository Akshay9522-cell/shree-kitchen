const express = require("express");

const router = express.Router();

const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController");

const {
  protect,
} = require("../middlewares/authMiddleware");

router.use(protect);

router.post("/", addToCart);

router.get("/", getCart);

router.put("/:productId", updateCartItem);

router.delete("/:productId", removeCartItem);

module.exports = router;