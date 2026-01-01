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
        // Eski va xato indekslarni o'chirish (agar mavjud bo'lsa)
        try {
            const User = require("./models/User");
            
            // Bo'sh stringli phoneNumber'larni tozalash (unique indeks ishlashi uchun)
            await User.updateMany(
                { phoneNumber: "" },
                { $unset: { phoneNumber: "" } }
            );

            await User.collection.dropIndex("phone_1");
            console.log("Old 'phone_1' index dropped and empty phoneNumbers cleaned");
        } catch (e) {
            // Indeks mavjud bo'lmasa yoki boshqa xato bo'lsa ham davom etamiz
        }
    })
    .catch((err) => {
        console.error("MongoDB connection error details:", err);
        process.exit(1);
    });

const isProduction = process.env.NODE_ENV === "production";
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
    polling: !isProduction
});

const User = require("./models/User");

// Bot commands
bot.setMyCommands([
    { command: '/start', description: 'Botni ishga tushirish' },
    { command: '/help', description: 'Yordam olish' }
]);

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Assalomu alaykum! Savdo tizimi botiga xush kelibsiz.\n\nIltimos, tizimdan foydalanish uchun telefon raqamingizni yuboring:", {
        reply_markup: {
            keyboard: [
                [
                    {
                        text: "Telefon raqamni yuborish",
                        request_contact: true
                    }
                ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
});

bot.on('contact', async (msg) => {
    const chatId = msg.chat.id;
    const phoneNumber = msg.contact.phone_number.replace(/\+/g, "");
    
    try {
        // Raqamni bir necha formatda qidiramiz (asl holatda, + bilan, +siz)
        const user = await User.findOne({
            $or: [
                { phoneNumber: phoneNumber },
                { phoneNumber: `+${phoneNumber}` },
                { phoneNumber: phoneNumber.startsWith("998") ? phoneNumber.substring(3) : phoneNumber }
            ]
        });

        if (user) {
            user.telegramId = chatId.toString();
            if (msg.from.username) user.username = msg.from.username;
            if (!user.firstName) user.firstName = msg.from.first_name;
            if (!user.lastName) user.lastName = msg.from.last_name;
            await user.save();

            bot.sendMessage(chatId, "Tabriklaymiz! Siz muvaffaqiyatli ro'yxatdan o'tdingiz.\n\nEndi Web App'dan foydalanishingiz mumkin:", {
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
        } else {
            bot.sendMessage(chatId, "Kechirasiz, siz sotuvchilar ro'yxatida yo'qsiz. Iltimos, admin bilan bog'laning.");
        }
    } catch (error) {
        console.error("Bot contact error:", error);
        bot.sendMessage(chatId, "Xatolik yuz berdi. Iltimos keyinroq qayta urunib ko'ring.");
    }
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