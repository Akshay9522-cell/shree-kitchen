const express = require("express");

const router = express.Router();

const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

/*
PUBLIC ROUTES
*/
router.get("/", getProducts);

router.get("/:id", getProductById);

/*
ADMIN ROUTES
*/
router.post(
  "/",
  protect,
  authorize("admin"),
  addProduct
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteProduct
);

module.exports = router;