const User = require("../models/User");

const authenticate = async (req, res, next) => {
  try {
    // VAQTINCHALIK: Test uchun Telegram ID bo'lmasa "test_user" ishlatiladi
    const telegramId = req.headers["x-telegram-id"] || req.body.telegramId || "test_user";

    if (!telegramId) {
      return res.status(401).json({ error: "Telegram ID is required" });
    }

    let user = await User.findOne({ telegramId });

    if (!user) {
      // Auto-create user if doesn't exist
      user = await User.create({
        telegramId,
        role: (telegramId === process.env.ADMIN_ID || telegramId === "test_user") ? "admin" : "seller",
        firstName: telegramId === "test_user" ? "Test" : "",
        lastName: telegramId === "test_user" ? "User" : "",
        username: telegramId === "test_user" ? "testuser" : "",
      });
    } else if (telegramId === "test_user" && user.role !== "admin") {
      // Ensure test_user is always admin
      user.role = "admin";
      await user.save();
    }

    req.user = user;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Authentication failed", message: error.message });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Access denied. Admin role required." });
  }
  next();
};

const isSeller = (req, res, next) => {
  if (req.user.role !== "seller") {
    return res
      .status(403)
      .json({ error: "Access denied. Seller role required." });
  }
  next();
};

module.exports = { authenticate, isAdmin, isSeller };

