# Vercel Deployment Qo'llanmasi

## Variant 1: Frontend Vercel'da, Backend Alohida (Tavsiya etiladi)

Bu eng yaxshi variant, chunki Express.js server Vercel'da optimal ishlamaydi.

### 1. Backend'ni Deploy Qiling (Railway, Render, yoki Heroku)

#### Railway (Tavsiya etiladi)

1. [Railway](https://railway.app) ga o'ting va sign up qiling
2. "New Project" > "Deploy from GitHub repo"
3. Repository'ni tanlang
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Environment Variables qo'shing:
   ```
   TELEGRAM_BOT_TOKEN=your_token
   MONGO_URI=your_mongodb_uri
   ADMIN_ID=your_admin_id
   JWT_SECRET=your_secret
   NODE_ENV=production
   PORT=5000
   ```
8. Deploy qiling
9. URL'ni oling (masalan: `https://your-app.railway.app`)

### 2. Frontend'ni Vercel'da Deploy Qiling

1. [Vercel](https://vercel.com) ga login qiling
2. "New Project" > GitHub repo'ni tanlang
3. Root Directory: `frontend`
4. Framework Preset: Next.js
5. Build Command: `npm run build` (default)
6. Output Directory: `.next` (default)
7. Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
   ```
8. Deploy qiling

### 3. vercel.json Sozlash

Loyiha root'ida `vercel.json` fayli bo'lishi kerak:

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/.next",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend-url.railway.app/api/:path*"
    }
  ]
}
```

## Variant 2: Frontend va Backend Vercel'da (Serverless)

Agar backend'ni ham Vercel'da ishga tushirmoqchi bo'lsangiz:

### 1. API Folder Yaratish

`api/` papkasida serverless function yarating (qilingan)

### 2. Vercel Project Settings

1. Root Directory: `/` (root)
2. Build Command: 
   ```bash
   cd frontend && npm install && npm run build
   ```
3. Output Directory: `frontend/.next`
4. Install Command: `npm install`

### 3. Environment Variables

Vercel Dashboard > Settings > Environment Variables:

```
# Backend
MONGO_URI=your_mongodb_uri
TELEGRAM_BOT_TOKEN=your_token
ADMIN_ID=your_admin_id
JWT_SECRET=your_secret
NODE_ENV=production

# Frontend
NEXT_PUBLIC_API_URL=/api
```

### 4. vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"
    },
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

## Qadamlar

### 1. GitHub'ga Push Qiling

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Vercel'ga Deploy

1. Vercel Dashboard'ga o'ting
2. "Import Project"
3. GitHub repo'ni tanlang
4. Settings'ni sozlang (yuqoridagidek)
5. "Deploy" bosing

### 3. Environment Variables Qo'shing

Vercel Dashboard > Project > Settings > Environment Variables

### 4. Telegram Bot URL'ni Yangilang

1. [@BotFather](https://t.me/botfather) ga o'ting
2. `/myapps` > Bot'ni tanlang
3. Web App URL'ni yangilang: `https://your-frontend-url.vercel.app`

## Muammolarni Hal Qilish

### CORS Xatosi

Backend'da CORS sozlang:

```javascript
app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

### API URL Xatosi

Frontend'da `NEXT_PUBLIC_API_URL` to'g'ri sozlanganligini tekshiring.

### MongoDB Connection

MongoDB Atlas'da Network Access'ga Vercel IP'larini qo'shing yoki `0.0.0.0/0` qo'shing.

## Production Checklist

- [ ] Backend deployed va ishlayapti
- [ ] Frontend deployed va ishlayapti
- [ ] Environment variables sozlangan
- [ ] MongoDB ulangan
- [ ] CORS sozlangan
- [ ] Telegram bot URL yangilangan
- [ ] Test qiling

