# Vercel Monorepo Deploy Qo'llanmasi

Bu qo'llanma ikkala loyihani (Backend va Frontend) bitta Vercel'da ishga tushirish uchun.

## 📁 Struktura

```
├── frontend/          # Next.js Frontend
├── backend/           # Express.js Backend (routes va models)
├── api/               # Vercel Serverless Function (backend'ni ishga tushiradi)
└── vercel.json        # Vercel config
```

## 🚀 Deploy Qadamlar

### 1. GitHub'ga Push Qiling

```bash
git add .
git commit -m "Ready for Vercel monorepo deployment"
git push origin main
```

### 2. Vercel'da Project Yarating

1. [Vercel.com](https://vercel.com) ga login qiling
2. "Add New Project" bosing
3. GitHub repository'ni tanlang
4. **Configure Project:**
   - **Root Directory:** `/` (root - o'zgartirmang!)
   - **Framework Preset:** Next.js (automatic detect)
   - **Build Command:** `cd frontend && npm install && npm run build && cd ../api && npm install`
   - **Output Directory:** `frontend/.next`
   - **Install Command:** `npm run install:all`

### 3. Environment Variables Qo'shing

Vercel Dashboard > Settings > Environment Variables:

```
# MongoDB
MONGO_URI=mongodb+srv://bilol09876_db_user:wNaPpcj2DQjpUSk3@cluster0.puw13ji.mongodb.net/?appName=Cluster0

# Telegram
TELEGRAM_BOT_TOKEN=8595127073:AAG1L_k7VrGXYT-JIfeuL50x6l4r-0AF8xk
ADMIN_ID=1261889753

# Security
JWT_SECRET=your-secret-jwt-key-change-this-in-production

# Frontend
NEXT_PUBLIC_API_URL=/api

# Other
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

**Muhim:** `NEXT_PUBLIC_API_URL=/api` - Bu relative path, chunki backend va frontend bir xil domain'da.

### 4. Deploy!

"Deploy" tugmasini bosing va kutib turing.

## 🔧 vercel.json Tushuntirish

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json", // Frontend build
      "use": "@vercel/next"
    },
    {
      "src": "api/index.js", // Backend serverless function
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)", // API so'rovlar backend'ga
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)", // Boshqa so'rovlar frontend'ga
      "dest": "frontend/$1"
    }
  ],
  "functions": {
    "api/index.js": {
      "maxDuration": 30 // Serverless function timeout (30 soniya)
    }
  }
}
```

## ⚠️ Muhim Eslatmalar

### 1. Telegram Bot Polling

Vercel Serverless Functions'da `polling: true` ishlamaydi. Webhook ishlatish kerak yoki bot'ni alohida server'da ishlatish kerak.

**Yechim:** Telegram bot polling'ni o'chirib, faqat webhook ishlatish yoki bot'ni alohida server'da ishga tushirish.

### 2. MongoDB Connection

Serverless Functions'da connection pool'ni yaxshi boshqarish kerak. Kodda `isConnected` check qo'shildi.

### 3. Cold Start

Birinchi so'rov sekinroq bo'lishi mumkin (cold start). Bu normal.

### 4. Timeout

Maksimal 30 soniya timeout. Agar kerak bo'lsa, Vercel Pro'da 60 soniyagacha oshirish mumkin.

## 🧪 Testing

Deploy qilingandan keyin:

1. **Frontend:** `https://your-app.vercel.app`
2. **Backend Health:** `https://your-app.vercel.app/api/health`
3. **API Endpoint:** `https://your-app.vercel.app/api/auth/me`

## 🔄 Telegram Bot Sozlash

1. [@BotFather](https://t.me/botfather) ga o'ting
2. `/myapps` > Bot'ni tanlang
3. Web App URL: `https://your-app.vercel.app`

## 🐛 Muammolarni Hal Qilish

### MongoDB Connection Error

- Environment variable to'g'ri sozlanganligini tekshiring
- MongoDB Atlas'da Network Access sozlang (0.0.0.0/0)

### API 404 Error

- `vercel.json` routes to'g'ri sozlanganligini tekshiring
- Build loglarini ko'ring

### Build Error

- `api/package.json` mavjudligini tekshiring
- Dependencies to'g'ri o'rnatilganligini tekshiring

### CORS Error

- Backend CORS sozlamalari to'g'ri ekanligini tekshiring
- `FRONTEND_URL` environment variable sozlang

## 📊 Monitoring

Vercel Dashboard'da:

- **Functions** - API calls va performance
- **Analytics** - Traffic va errors
- **Logs** - Real-time logs

## 🎯 Alternative: Backend'ni Alohida Deploy Qilish

Agar serverless functions muammo bersa, backend'ni Railway yoki Render'da deploy qilish tavsiya etiladi:

- [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Backend Railway'da, Frontend Vercel'da
