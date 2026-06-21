const Product = require("../models/Product");

// Add Product
exports.addProduct = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }
//     console.log("BODY:", req.body);
// console.log("FILE:", req.file);

    // const product = await Product.create({
    //   name: req.body.name,
    //   description: req.body.description,
    //   price: req.body.price,
    //   image: req.file.path, // Cloudinary URL
    // });
const product = await Product.create({
  name: req.body.name,
  description: req.body.description,
  price: req.body.price,
  originalPrice: req.body.originalPrice,
  category: req.body.category,
  stock: req.body.stock,
  capacity: req.body.capacity,
  material: req.body.material,
  featured: req.body.featured,
  image: req.file.path,
});
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Products
exports.getProducts = async (req, res) => {
  try {

    const keyword = req.query.keyword
  ? {
      name: {
        $regex: req.query.keyword,
        $options: "i",
      },
    }
  : {};

const category = req.query.category
  ? {
      category: req.query.category,
    }
  : {};

 let sortOption = {};

    if (req.query.sort === "low") {
      sortOption = { price: 1 };
    }

    if (req.query.sort === "high") {
      sortOption = { price: -1 };
    }  
    const priceFilter =
  req.query.maxPrice
    ? {
        price: {
          $lte: Number(
            req.query.maxPrice
          ),
        },
      }
    : {};

const page = Number(req.query.page) || 1;
const limit = 8;

const skip = (page - 1) * limit;

const totalProducts =
  await Product.countDocuments({
    ...keyword,
    ...category,
    ...priceFilter,
    isActive: true,
  });


const products = await Product.find({
  ...keyword,
  ...category,
  ...priceFilter,
  isActive: true,
}).sort(sortOption)
  .skip(skip)
  .limit(limit);


    res.json({
      success: true,
      count: products.length,
      products,
      currentPage: page,
      totalPages: Math.ceil(
        totalProducts / limit
      ),
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Get Single Product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
  console.log(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isActive = false;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};