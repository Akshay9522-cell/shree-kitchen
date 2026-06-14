const express = require("express");

const router = express.Router();

const {
  addProduct,
  getProducts,
  getProductById,
} = require("../controllers/productController");

router.post("/", addProduct);

router.get("/", getProducts);

router.get("/:id", getProductById);

module.exports = router;