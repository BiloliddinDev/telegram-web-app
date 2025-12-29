# Deployment Qo'llanmasi

## Backend Deployment (Heroku, Railway, yoki VPS)

### Heroku

1. Heroku CLI o'rnating
2. Heroku'ga login qiling: `heroku login`
3. Yangi app yarating: `heroku create your-app-name`
4. MongoDB Atlas'ga ulaning yoki Heroku addon qo'shing
5. Environment variables'ni sozlang:
   ```bash
   heroku config:set TELEGRAM_BOT_TOKEN=your_token
   heroku config:set MONGO_URI=your_mongodb_uri
   heroku config:set ADMIN_ID=your_admin_id
   heroku config:set JWT_SECRET=your_secret
   ```
6. Deploy qiling: `git push heroku main`

### Railway

1. Railway'ga login qiling
2. New Project yarating
3. GitHub repo'ni ulang
4. Environment variables'ni sozlang
5. Deploy qiling

### VPS (Ubuntu/Debian)

1. Node.js va npm o'rnating
2. PM2 o'rnating: `npm install -g pm2`
3. Kodni clone qiling
4. Dependencies o'rnating: `npm install`
5. .env faylini yarating
6. PM2 bilan ishga tushiring: `pm2 start server.js --name telegram-app`
7. Nginx reverse proxy sozlang

## Frontend Deployment (Vercel, Netlify)

### Vercel (Tavsiya etiladi)

1. Vercel'ga login qiling
2. New Project yarating
3. GitHub repo'ni ulang
4. Environment variables'ni sozlang:
   - `NEXT_PUBLIC_API_URL`: Backend URL
5. Deploy qiling

### Netlify

1. Netlify'ga login qiling
2. New site from Git
3. Repo'ni tanlang
4. Build settings:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/.next`
5. Environment variables'ni sozlang
6. Deploy qiling

## Telegram Bot Sozlash

1. [@BotFather](https://t.me/botfather) ga o'ting
2. `/newbot` - yangi bot yarating
3. Bot tokenini oling
4. `/newapp` - yangi Web App yarating
5. Web App URL'ini frontend hosting manziliga o'rnating
6. Bot description va commands sozlang

## MongoDB Atlas

1. MongoDB Atlas account yarating
2. Cluster yarating
3. Database user yarating
4. Network Access sozlang (0.0.0.0/0 yoki specific IP)
5. Connection string'ni oling

## Environment Variables

### Backend (.env)
```
TELEGRAM_BOT_TOKEN=your_bot_token
MONGO_URI=your_mongodb_connection_string
ADMIN_ID=your_telegram_user_id
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=production
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

## Post-Deployment Checklist

- [ ] Backend ishlayaptimi?
- [ ] Frontend ishlayaptimi?
- [ ] MongoDB ulanganmi?
- [ ] Telegram bot ishlayaptimi?
- [ ] Web App Telegram'da ochilayaptimi?
- [ ] Authentication ishlayaptimi?
- [ ] Admin panel ishlayaptimi?
- [ ] Seller panel ishlayaptimi?

## Monitoring

- PM2 monitoring: `pm2 monit`
- Logs: `pm2 logs`
- Health check: `GET /api/health`

