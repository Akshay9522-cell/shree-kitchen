
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const authRoutes = require("./routes/authRoutes");
app.use(cors());
app.use(express.json());
const connectDB = require("./config/db");
connectDB();

app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Shree Kitchen API Running 🚀");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
