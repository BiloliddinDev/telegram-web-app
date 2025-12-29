# 🚀 Vercel Monorepo Deploy - Batafsil Qo'llanma

## ✅ Tayyorlangan Narsalar

1. ✅ `vercel.json` - Vercel config (backend va frontend birga)
2. ✅ `api/index.js` - Backend serverless function
3. ✅ `api/package.json` - API dependencies
4. ✅ Frontend API URL sozlandi (`/api` - relative path)

## 📋 Deploy Qadamlar

### 1. GitHub'ga Push

```bash
git add .
git commit -m "Ready for Vercel monorepo"
git push origin main
```

### 2. Vercel'da Project Yarating

1. [vercel.com](https://vercel.com) ga login qiling
2. **"Add New Project"** bosing
3. GitHub repo'ni tanlang
4. **Configure Project:**

   ⚠️ **MUHIM SOZLAMALAR:**

   ```
   Root Directory: / (root - o'zgartirmang!)
   Framework Preset: Next.js (automatic detect bo'ladi)
   ```

   **Environment Variables qo'shing:**

   ```
   MONGO_URI=mongodb+srv://bilol09876_db_user:wNaPpcj2DQjpUSk3@cluster0.puw13ji.mongodb.net/?appName=Cluster0
   TELEGRAM_BOT_TOKEN=8595127073:AAG1L_k7VrGXYT-JIfeuL50x6l4r-0AF8xk
   ADMIN_ID=1261889753
   JWT_SECRET=your-secret-jwt-key-change-this-in-production
   NEXT_PUBLIC_API_URL=/api
   NODE_ENV=production
   ```

5. **"Deploy"** bosing!

### 3. Build Sozlamalari

Vercel avtomatik detect qiladi, lekin agar kerak bo'lsa:

- **Build Command:** `cd frontend && npm install && npm run build && cd ../api && npm install`
- **Output Directory:** `frontend/.next`
- **Install Command:** (bo'sh qoldiring, vercel.json ishlaydi)

## 🔍 Qanday Ishlaydi?

```
User Request → Vercel
                ↓
        vercel.json routes
                ↓
    /api/* → api/index.js (Backend Serverless)
    /* → frontend/* (Next.js Frontend)
```

## ✅ Test Qilish

Deploy qilingandan keyin:

1. **Frontend:** `https://your-app.vercel.app`
2. **Backend Health Check:** `https://your-app.vercel.app/api/health`
3. **API Test:** `https://your-app.vercel.app/api/auth/me`

## ⚠️ Muhim Eslatmalar

### Telegram Bot Polling

⚠️ **Vercel Serverless Functions'da bot polling ishlamaydi!**

**Yechimlar:**

1. **Bot'ni alohida server'da ishga tushirish** (Railway, Render)
   - Faqat bot uchun alohida server
   - API Vercel'da qoladi

2. **Webhook ishlatish** (Tavsiya etiladi)
   - Bot webhook orqali ishlaydi
   - API Vercel'da

3. **Bot funksiyasini olib tashlash**
   - Faqat API ishlatish
   - Bot kerak bo'lmasa

### MongoDB Connection

- Environment variable to'g'ri sozlang
- MongoDB Atlas'da Network Access: `0.0.0.0/0`

### CORS

- Backend CORS sozlamalari to'g'ri
- Vercel domain avtomatik allow qilinadi

## 🐛 Muammolarni Hal Qilish

### Build Error

```
Error: Cannot find module '../backend/routes/auth'
```

**Yechim:** `api/index.js` da path'lar to'g'ri ekanligini tekshiring.

### MongoDB Connection Error

```
MongoDB connection error
```

**Yechim:**
- Environment variable to'g'ri sozlanganligini tekshiring
- MongoDB Atlas Network Access sozlang

### API 404 Error

**Yechim:**
- `vercel.json` routes to'g'ri ekanligini tekshiring
- Build loglarini ko'ring

### CORS Error

**Yechim:**
- Backend CORS sozlamalari to'g'ri
- `FRONTEND_URL` environment variable (ixtiyoriy)

## 📊 Monitoring

Vercel Dashboard'da:
- **Functions** - API performance
- **Analytics** - Traffic
- **Logs** - Real-time logs

## 🎯 Telegram Bot URL Yangilash

1. [@BotFather](https://t.me/botfather)
2. `/myapps` > Bot'ni tanlang
3. Web App URL: `https://your-app.vercel.app`

## ✅ Checklist

- [ ] GitHub'ga push qilindi
- [ ] Vercel'da project yaratildi
- [ ] Root Directory: `/` (root)
- [ ] Environment variables qo'shildi
- [ ] Deploy qilindi
- [ ] Health check ishlayapti (`/api/health`)
- [ ] Frontend ochilayapti
- [ ] Telegram bot URL yangilandi

## 📚 Qo'shimcha Ma'lumot

- [VERCEL_MONOREPO.md](./VERCEL_MONOREPO.md) - Batafsil qo'llanma
- [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) - Alternative variantlar

