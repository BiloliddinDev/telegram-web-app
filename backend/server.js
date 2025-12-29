const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const TelegramBot = require("node-telegram-bot-api");

dotenv.config();

const app = express();

app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

const isProduction = process.env.NODE_ENV === "production";
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
    polling: !isProduction
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/seller", require("./routes/seller"));
app.use("/api/products", require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/sales", require("./routes/sales"));
app.use("/api/reports", require("./routes/reports"));

app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "Server is running" });
});

if (!isProduction) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;