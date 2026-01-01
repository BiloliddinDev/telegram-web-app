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
    .then(async () => {
        console.log("MongoDB connected successfully to:", process.env.MONGO_URI.split('@').pop());
    })
    .catch((err) => {
        console.error("MongoDB connection error details:", err);
        process.exit(1);
    });

const normalizePhone = (phone) => {
    let cleaned = phone.replace(/\D/g, ""); // Faqat raqamlarni qoldiradi
    if (!cleaned.startsWith("998")) {
        cleaned = "998" + cleaned; // Agar 901234567 bo'lsa, 998 qo'shadi
    }
    return cleaned;
};

const isProduction = process.env.NODE_ENV === "production";
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
    polling: !isProduction
});

bot.on("polling_error", (error) => {
    if (error.code === 'EFATAL') {
        console.error("Bot boshqa joyda ishlab turibdi (Conflict). Iltimos, boshqa instance'larni o'chiring.");
    } else {
        console.error("Polling error:", error.code, error.message);
    }
});

const User = require("./models/User");

const FRONTEND_URL = process.env.FRONTEND_URL || "https://telegram-web-app-sand.vercel.app/";

// Bot Handlers
const handleStartCommand = async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        const user = await User.findOne({ telegramId: chatId.toString() });
        
        if (user) {
            return bot.sendMessage(chatId, `Xush kelibsiz, ${user.firstName}! Savdo tizimi botidan foydalanishingiz mumkin.`, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Web App-ni ochish",
                                web_app: { url: FRONTEND_URL }
                            }
                        ]
                    ]
                }
            });
        }

        bot.sendMessage(chatId, "Assalomu alaykum! Tizimdan foydalanish uchun telefon raqamingizni tasdiqlashingiz kerak.", {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: "📱 Telefon raqamni yuborish",
                            request_contact: true
                        }
                    ]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
    } catch (error) {
        console.error("Start command error:", error);
        bot.sendMessage(chatId, "Xatolik yuz berdi. Iltimos keyinroq qayta urunib ko'ring.");
    }
};

const handleContactMessage = async (msg) => {
    const chatId = msg.chat.id;
    
    if (msg.contact.user_id !== msg.from.id) {
        return bot.sendMessage(chatId, "Xavfsizlik maqsadida faqat o'zingizning telefon raqamingizni yuboring.");
    }

    const rawPhoneNumber = msg.contact.phone_number;
    const normalizedPhoneNumber = normalizePhone(rawPhoneNumber);
    
    try {
        // Raqamni bir necha formatda qidiramiz
        const user = await User.findOne({
            $or: [
                { phoneNumber: normalizedPhoneNumber },
                { phoneNumber: `+${normalizedPhoneNumber}` },
                { phoneNumber: normalizedPhoneNumber.startsWith("998") ? normalizedPhoneNumber.substring(3) : normalizedPhoneNumber }
            ]
        });

        if (user) {
            user.telegramId = chatId.toString();
            if (msg.from.username) user.username = msg.from.username;
            if (msg.from.first_name) user.firstName = msg.from.first_name;
            if (msg.from.last_name) user.lastName = msg.from.last_name;
            await user.save();

            bot.sendMessage(chatId, "Muvaffaqiyatli bog'landi! Endi Web App-dan foydalanishingiz mumkin:", {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Web App-ni ochish",
                                web_app: { url: FRONTEND_URL }
                            }
                        ]
                    ]
                }
            });
        } else {
            bot.sendMessage(chatId, "Kechirasiz, siz sotuvchilar ro'yxatida yo'qsiz. Iltimos, admin bilan bog'laning.");
        }
    } catch (error) {
        console.error("Bot contact error:", error);
        bot.sendMessage(chatId, "Xatolik yuz berdi. Iltimos keyinroq qayta urunib ko'ring.");
    }
};

// Bot commands
bot.setMyCommands([
    { command: '/start', description: 'Botni ishga tushirish' },
    { command: '/help', description: 'Yordam olish' }
]);

bot.onText(/\/start/, handleStartCommand);
bot.on('contact', handleContactMessage);

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
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/transfers", require("./routes/transfers"));

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