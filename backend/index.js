  const dns = require('node:dns');
  dns.setDefaultResultOrder('ipv4first'); 
  require('node:dns/promises').setServers(['8.8.8.8', '1.1.1.1']);
  const express = require("express");
  const cors = require("cors");
  require("dotenv").config();

  const app = express();
  const authRoutes = require("./routes/authRoutes");
  const productRoutes = require("./routes/productRoutes");
  const cartRoutes = require("./routes/cartRoutes");
  const orderRoutes = require("./routes/orderRoutes");
  const paymentRoutes = require("./routes/paymentRoutes");
  const adminRoutes = require("./routes/adminRoute");
  app.use(cors());
  app.use(express.json());
  const connectDB = require("./config/db");
  connectDB();

  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/cart", cartRoutes);

  app.use("/api/orders", orderRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/admin",adminRoutes);
  app.get("/", (req, res) => {
    res.send("Shree Kitchen API Running 🚀");
  });


  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
