const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "https://*.vercel.app",
      /\.vercel\.app$/,
    ],
    credentials: true,
  })
);
app.use(express.json());

// MongoDB connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

// Routes - Backend routes'larini import qilish
// Note: Telegram Bot polling Vercel Serverless'da ishlamaydi
// Bot'ni alohida server'da ishga tushirish kerak yoki webhook ishlatish

const authRoutes = require("../backend/routes/auth");
const adminRoutes = require("../backend/routes/admin");
const sellerRoutes = require("../backend/routes/seller");
const productsRoutes = require("../backend/routes/products");
const salesRoutes = require("../backend/routes/sales");
const reportsRoutes = require("../backend/routes/reports");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/reports", reportsRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running", timestamp: new Date() });
});

// Vercel serverless function handler
module.exports = async (req, res) => {
  // MongoDB'ga ulanamiz
  await connectDB();
  
  // Express app'ni ishga tushiramiz
  return app(req, res);
};
