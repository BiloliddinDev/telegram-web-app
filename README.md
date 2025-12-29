# Telegram Web App - Sales Management System

Bu loyiha Telegram Web App orqali ishlaydigan sotuv boshqaruv tizimidir.

## Xususiyatlar

### Admin Panel

- Oylik hisobotlarni boshqarish va tahlil qilish
- Yangi mahsulot qo'shish
- Sotuvchilarga mahsulot biriktirish
- Yangi sotuvchi qo'shish
- Barcha sotuvlarni ko'rish

### Sotuvchi Panel

- Biriktirilgan mahsulotlarni ko'rish
- Mahsulot sotish
- O'z hisobotlarini ko'rish
- Sotuvlar tarixini ko'rish

## Texnologiyalar

### Backend

- Express.js
- Node.js
- MongoDB (Mongoose)
- node-telegram-bot-api
- Nodemon

### Frontend

- Next.js 14
- ShadcnUI
- Zustand
- TypeScript
- Tailwind CSS

## O'rnatish

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend `http://localhost:5000` portida ishlaydi.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:3000` portida ishlaydi.

## Konfiguratsiya

Backend `.env` faylini yarating va quyidagi o'zgaruvchilarni to'ldiring:

```
TELEGRAM_BOT_TOKEN=your_bot_token
MONGO_URI=your_mongodb_uri
ADMIN_ID=your_telegram_user_id
JWT_SECRET=your_jwt_secret
PORT=5000
```

Frontend `.env.local` faylini yarating:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Foydalanish

1. Telegram bot yarating va Web App qo'shing
2. Backend va Frontend serverlarini ishga tushiring
3. Telegram orqali Web App'ga kirish
4. Admin yoki Sotuvchi sifatida tizimga kirish

## API Endpoints

### Auth

- `GET /api/auth/me` - Joriy foydalanuvchi ma'lumotlari
- `PUT /api/auth/me` - Foydalanuvchi ma'lumotlarini yangilash

### Admin

- `GET /api/admin/sellers` - Barcha sotuvchilar
- `POST /api/admin/sellers` - Yangi sotuvchi qo'shish
- `PUT /api/admin/sellers/:id` - Sotuvchini yangilash
- `DELETE /api/admin/sellers/:id` - Sotuvchini o'chirish
- `POST /api/admin/sellers/:sellerId/products/:productId` - Mahsulotni sotuvchiga biriktirish
- `DELETE /api/admin/sellers/:sellerId/products/:productId` - Mahsulotni olib tashlash
- `GET /api/admin/reports/monthly` - Oylik hisobot

### Seller

- `GET /api/seller/products` - Biriktirilgan mahsulotlar
- `GET /api/seller/sales` - Sotuvlar
- `GET /api/seller/reports` - Hisobotlar

### Products

- `GET /api/products` - Barcha mahsulotlar (admin only)
- `GET /api/products/:id` - Bitta mahsulot
- `POST /api/products` - Yangi mahsulot qo'shish (admin only)
- `PUT /api/products/:id` - Mahsulotni yangilash (admin only)
- `DELETE /api/products/:id` - Mahsulotni o'chirish (admin only)

### Sales

- `POST /api/sales` - Yangi sotuv yaratish
- `GET /api/sales` - Barcha sotuvlar (admin ko'radi hammasini, seller faqat o'zini)
- `GET /api/sales/:id` - Bitta sotuv

### Reports

- `GET /api/reports` - Hisobotlar (role'ga qarab)

## Qo'shimcha Xususiyatlar

- ✅ Input validation
- ✅ Error handling
- ✅ Toast notifications
- ✅ Loading states
- ✅ Responsive design
- ✅ Role-based access control

## Qo'llanmalar

- [SETUP.md](./SETUP.md) - Batafsil o'rnatish qo'llanmasi
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment qo'llanmasi
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contributing qo'llanmasi
- [CHANGELOG.md](./CHANGELOG.md) - O'zgarishlar ro'yxati

## Muallif

Bu loyiha Telegram Web App uchun yaratilgan.
