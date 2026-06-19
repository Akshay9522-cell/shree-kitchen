const express = require("express");
const upload = require("../middlewares/upload");
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
  upload.single("image"),
  addProduct
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.single("image"),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteProduct
);

module.exports = router;