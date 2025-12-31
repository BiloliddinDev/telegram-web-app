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
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected successfully to:", process.env.MONGO_URI.split('@').pop()))
    .catch((err) => {
        console.error("MongoDB connection error details:", err);
        process.exit(1);
    });

const isProduction = process.env.NODE_ENV === "production";
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
    polling: !isProduction
});

// Bot commands
bot.setMyCommands([
    { command: '/start', description: 'Botni ishga tushirish' },
    { command: '/help', description: 'Yordam olish' },
    { command: '/profile', description: 'Mening profilim' },
    { command: '/products', description: 'Mahsulotlar ro\'yxati' },
    { command: '/sales', description: 'Mening savdolarim' }
]);

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Assalomu alaykum! Savdo tizimi botiga xush kelibsiz.\n\nIltimos, tizimga kirish uchun Web App tugmasini bosing yoki admin bilan bog'laning.", {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Web App-ni ochish",
                        web_app: { url: process.env.FRONTEND_URL || "https://your-frontend-url.com" }
                    }
                ]
            ]
        }
    });
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Ushbu bot orqali siz mahsulotlarni sotishingiz va hisobotlarni ko'rishingiz mumkin.\n\nAgar muammo bo'lsa, @admin bilan bog'laning.");
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