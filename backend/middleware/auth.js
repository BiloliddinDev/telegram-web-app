const User = require("../models/User");

const authenticate = async (req, res, next) => {
  try {
    const telegramId = req.headers["x-telegram-id"] || req.body.telegramId;

    if (!telegramId) {
      return res.status(401).json({ error: "Telegram ID is required" });
    }

    let user = await User.findOne({ 
      $or: [
        { telegramId: telegramId },
        { phoneNumber: telegramId } // In case phone number is sent as ID
      ]
    });

    if (!user) {
      // Auto-create user if doesn't exist
      user = await User.create({
        telegramId,
        role: telegramId === process.env.ADMIN_ID ? "admin" : "seller",
      });
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

