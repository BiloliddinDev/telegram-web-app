const User = require("../models/User");

const authenticate = async (req, res, next) => {
  try {
    const telegramId = req.headers["x-telegram-id"];
    const initData = req.headers["x-telegram-init-data"];

    if (!telegramId) {
      return res.status(401).json({ error: "Telegram ID is required" });
    }

    let telegramUser = null;
    if (initData) {
      try {
        const params = new URLSearchParams(initData);
        const userStr = params.get("user");
        if (userStr) {
          telegramUser = JSON.parse(decodeURIComponent(userStr));
        }
      } catch (e) {
        console.error("Error parsing initData in middleware:", e);
      }
    }

    let user = await User.findOne({
      $or: [
        { telegramId: telegramId },
        { phoneNumber: telegramId },
      ],
    });

    if (!user) {
      // Auto-create user if doesn't exist
      user = await User.create({
        telegramId,
        firstName: telegramUser?.first_name || "",
        lastName: telegramUser?.last_name || "",
        username: telegramUser?.username || "",
        avatarUrl: telegramUser?.photo_url || "",
        role: telegramId === process.env.ADMIN_ID ? "admin" : "seller",
      });
    } else {
      // Update existing user info from Telegram if available
      let updated = false;
      if (telegramUser) {
        if (!user.telegramId) {
          user.telegramId = telegramId;
          updated = true;
        }
        if (telegramUser.username && user.username !== telegramUser.username) {
          user.username = telegramUser.username;
          updated = true;
        }
        if (telegramUser.photo_url && user.avatarUrl !== telegramUser.photo_url) {
          user.avatarUrl = telegramUser.photo_url;
          updated = true;
        }
        // Faqat admin kiritmagan bo'lsa yoki bo'sh bo'lsa yangilaymiz
        if (telegramUser.first_name && !user.firstName) {
          user.firstName = telegramUser.first_name;
          updated = true;
        }
        if (telegramUser.last_name && !user.lastName) {
          user.lastName = telegramUser.last_name;
          updated = true;
        }
      }

      if (updated) {
        await user.save();
      }
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

