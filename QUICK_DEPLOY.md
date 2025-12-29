# Tez Deploy Qo'llanmasi

## Eng Yaxshi Variant: Frontend Vercel'da, Backend Railway'da

### 1. Backend'ni Railway'da Deploy Qiling (5 daqiqa)

1. [Railway.app](https://railway.app) ga o'ting va sign up qiling
2. "New Project" > "Deploy from GitHub repo"
3. Repository'ni tanlang
4. **Settings:**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Environment Variables qo'shing:**
   ```
   TELEGRAM_BOT_TOKEN=8595127073:AAG1L_k7VrGXYT-JIfeuL50x6l4r-0AF8xk
   MONGO_URI=mongodb+srv://bilol09876_db_user:wNaPpcj2DQjpUSk3@cluster0.puw13ji.mongodb.net/?appName=Cluster0
   ADMIN_ID=1261889753
   JWT_SECRET=your-secret-jwt-key-change-this
   NODE_ENV=production
   PORT=5000
   ```
6. Deploy qiling va URL'ni oling (masalan: `https://your-app.railway.app`)

### 2. Frontend'ni Vercel'da Deploy Qiling (3 daqiqa)

1. [Vercel.com](https://vercel.com) ga login qiling
2. "Add New Project" > GitHub repo'ni tanlang
3. **Configure Project:**
   - Framework Preset: **Next.js**
   - Root Directory: **frontend** (o'zgartiring!)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
4. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
   ```
   (Railway'dan olgan URL'ni qo'ying)
5. **Deploy** bosing!

### 3. vercel.json'ni Yangilang

`vercel.json` faylida backend URL'ni o'zgartiring:

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/.next",
  "installCommand": "cd frontend && npm install",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend-url.railway.app/api/:path*"
    }
  ]
}
```

### 4. Telegram Bot'ni Yangilang

1. [@BotFather](https://t.me/botfather) ga o'ting
2. `/myapps` > Bot'ni tanlang
3. Web App URL'ni yangilang: `https://your-frontend.vercel.app`

## Tugadi! ✅

Endi:
- Frontend: `https://your-frontend.vercel.app`
- Backend: `https://your-backend.railway.app`
- Telegram Bot: Web App orqali ishlaydi

## Muammo Bo'lsa

### CORS Xatosi
Backend'da `backend/server.js` faylida:

```javascript
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

### API URL Xatosi
Frontend `.env.local` yoki Vercel Environment Variables'da:
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

## GitHub Actions (Ixtiyoriy)

Avtomatik deploy qilish uchun `.github/workflows/deploy.yml` yarating (qilingan).

