# O'rnatish Qo'llanmasi

## 1. Backend O'rnatish

```bash
cd backend
npm install
```

### .env faylini yarating

`backend` papkasida `.env` faylini yarating va quyidagi ma'lumotlarni kiriting:

```
TELEGRAM_BOT_TOKEN=8595127073:AAG1L_k7VrGXYT-JIfeuL50x6l4r-0AF8xk
MONGO_URI=mongodb+srv://bilol09876_db_user:wNaPpcj2DQjpUSk3@cluster0.puw13ji.mongodb.net/?appName=Cluster0
ADMIN_ID=1261889753
JWT_SECRET=your-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

### Backendni ishga tushirish

```bash
npm run dev
```

Backend `http://localhost:5000` portida ishlaydi.

## 2. Frontend O'rnatish

```bash
cd frontend
npm install
```

### Frontendni ishga tushirish

```bash
npm run dev
```

Frontend `http://localhost:3000` portida ishlaydi.

## 3. Telegram Bot Sozlash

1. [@BotFather](https://t.me/botfather) ga o'ting
2. `/newbot` buyrug'ini yuboring va bot yarating
3. Bot tokenini oling va `.env` fayliga qo'shing
4. `/newapp` buyrug'i bilan yangi Web App yarating
5. Web App URL'ini frontend hosting manziliga o'rnating (masalan: `https://yourdomain.com`)

## 4. MongoDB Sozlash

MongoDB Atlas yoki lokal MongoDB ishlatishingiz mumkin. `.env` faylida `MONGO_URI` ni to'g'ri sozlang.

## 5. Ishlatish

1. Backend va Frontend serverlarini ishga tushiring
2. Telegram orqali bot'ga o'ting
3. Web App tugmasini bosing
4. Admin yoki Sotuvchi sifatida tizimga kirish

## Muammo hal qilish

- Agar MongoDB ulanmasa, `MONGO_URI` ni tekshiring
- Agar Telegram Web App ishlamasa, bot tokenini tekshiring
- CORS xatosi bo'lsa, backend `cors` sozlamalarini tekshiring

