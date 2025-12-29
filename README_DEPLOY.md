# 🚀 Deploy Qo'llanmasi

## ⚡ Tez Deploy (Tavsiya etiladi)

### Backend: Railway'da

### Frontend: Vercel'da

**Batafsil qo'llanma:** [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

## 📋 Qadamlar

### 1️⃣ Backend Deploy (Railway)

```bash
1. Railway.app ga o'ting
2. New Project > Deploy from GitHub
3. Root Directory: backend
4. Environment Variables qo'shing
5. Deploy!
```

### 2️⃣ Frontend Deploy (Vercel)

```bash
1. Vercel.com ga o'ting
2. New Project > GitHub repo
3. Root Directory: frontend
4. Environment Variables qo'shing
5. Deploy!
```

### 3️⃣ vercel.json

Fayl allaqachon tayyor, faqat backend URL'ni o'zgartiring (agar kerak bo'lsa).

## 🔧 Environment Variables

### Backend (Railway)

```
TELEGRAM_BOT_TOKEN=your_token
MONGO_URI=your_mongodb_uri
ADMIN_ID=your_admin_id
JWT_SECRET=your_secret
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel)

```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

## ✅ Checklist

- [ ] Backend Railway'da deployed
- [ ] Frontend Vercel'da deployed
- [ ] Environment variables sozlangan
- [ ] CORS sozlangan
- [ ] Telegram bot URL yangilangan
- [ ] Test qiling

## 📚 Qo'shimcha Ma'lumot

- [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) - Batafsil Vercel qo'llanmasi
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Boshqa platformalar
- [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md) - Telegram bot sozlash
