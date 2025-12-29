const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const TelegramBot = require("node-telegram-bot-api");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Telegram Bot initialization
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/seller", require("./routes/seller"));
app.use("/api/products", require("./routes/products"));
app.use("/api/sales", require("./routes/sales"));
app.use("/api/reports", require("./routes/reports"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Telegram bot webhook (if needed)
app.post(`/bot${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export bot for use in other files
module.exports = { bot };
