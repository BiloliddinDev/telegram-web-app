const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const TelegramBot = require("node-telegram-bot-api");

dotenv.config();
const app = express();
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// Ensure DB connection for all requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ error: "Ma'lumotlar bazasiga ulanib bo'lmadi" });
    }
});

let cachedConnection = null;

const connectDB = async () => {
    if (cachedConnection && mongoose.connection.readyState >= 1) return cachedConnection;

    try {
        cachedConnection = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
        });
        console.log("MongoDB-ga ulanish o'rnatildi.");
        return cachedConnection;
    } catch (err) {
        console.error("DB ulanish xatosi:", err);
        cachedConnection = null;
        throw err;
    }
};

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
const User = require("./models/User");
const FRONTEND_URL = process.env.FRONTEND_URL || "https://telegram-web-app-sand.vercel.app/";

const normalizePhone = (phone) => {
    let cleaned = phone.replace(/\D/g, "");
    return cleaned.startsWith("998") ? cleaned : "998" + cleaned;
};

app.post("/api/webhook", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) return res.status(200).send("No message");

        const chatId = message.chat.id;
        const text = message.text;

        console.log(`Xabar keldi: ${message.from.username} -> ${text || 'Contact'}`);

        if (text === "/start") {
            await handleStartCommand(message);
        } else if (message.contact) {
            await handleContactMessage(message);
        } else if (text === "/help") {
            await bot.sendMessage(chatId, "Yordam uchun @admin bilan bog'laning.");
        }

        res.status(200).send("OK");
    } catch (e) {
        console.error("Webhook Error:", e);
        res.status(200).send("Error but OK");
    }
});

async function handleStartCommand(msg) {
    const chatId = msg.chat.id;
    const user = await User.findOne({ telegramId: chatId.toString() });

    if (user) {
        return bot.sendMessage(chatId, `Xush kelibsiz, ${user.firstName}!`, {
            reply_markup: {
                inline_keyboard: [[{ text: "Web App-ni ochish", web_app: { url: FRONTEND_URL } }]]
            }
        });
    }

    await bot.sendMessage(chatId, "Tizimdan foydalanish uchun telefon raqamingizni yuboring.", {
        reply_markup: {
            keyboard: [[{ text: "📱 Telefon raqamni yuborish", request_contact: true }]],
            resize_keyboard: true, one_time_keyboard: true
        }
    });
}

async function handleContactMessage(msg) {
    const chatId = msg.chat.id;
    if (msg.contact.user_id !== msg.from.id) {
        return bot.sendMessage(chatId, "Faqat o'z raqamingizni yuboring.");
    }

    const phoneNumber = normalizePhone(msg.contact.phone_number);
    const user = await User.findOne({
        $or: [{ phoneNumber: phoneNumber }, { phoneNumber: `+${phoneNumber}` }]
    });

    if (user) {
        user.telegramId = chatId.toString();
        user.username = msg.from.username || user.username;
        await user.save();

        await bot.sendMessage(chatId, "Muvaffaqiyatli bog'landi!", {
            reply_markup: {
                inline_keyboard: [[{ text: "Web App-ni ochish", web_app: { url: FRONTEND_URL } }]]
            }
        });
    } else {
        await bot.sendMessage(chatId, "Siz ro'yxatda yo'qsiz. Admin bilan bog'laning.");
    }
}

app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/sales", require("./routes/sales"));
app.use("/api/seller", require("./routes/seller"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/transfers", require("./routes/transfers"));

if (process.env.BACKEND_URL) {
    bot.setWebHook(`${process.env.BACKEND_URL}/api/webhook`)
        .then(() => console.log("Webhook OK"))
        .catch(console.error);
}

module.exports = app;