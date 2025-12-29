# Telegram Bot Sozlash Qo'llanmasi

## 1. Bot Yarating

1. [@BotFather](https://t.me/botfather) ga o'ting
2. `/newbot` buyrug'ini yuboring
3. Bot nomini kiriting (masalan: "Sales Manager Bot")
4. Bot username'ni kiriting (masalan: "sales_manager_bot")
5. Bot token'ni saqlang (masalan: `8595127073:AAG1L_k7VrGXYT-JIfeuL50x6l4r-0AF8xk`)

## 2. Web App Yarating

1. [@BotFather](https://t.me/botfather) da `/newapp` buyrug'ini yuboring
2. Bot'ni tanlang
3. Web App nomini kiriting
4. Web App URL'ini kiriting (frontend hosting manzili):
   ```
   https://your-frontend-url.com
   ```
5. Short name kiriting (masalan: "salesapp")

## 3. Bot'ni Sozlash

### Bot Description
```
/setdescription - Bot tavsifini o'rnating
Masalan: "Sotuvlar boshqaruv tizimi"
```

### Bot Commands
```
/setcommands
start - Botni boshlash
help - Yordam
```

### Bot Menu Button
```
/setmenubutton - Menu tugmasini sozlang
Web App URL'ni kiriting
```

## 4. Environment Variables

Backend `.env` faylida:

```env
TELEGRAM_BOT_TOKEN=8595127073:AAG1L_k7VrGXYT-JIfeuL50x6l4r-0AF8xk
MONGO_URI=mongodb+srv://bilol09876_db_user:wNaPpcj2DQjpUSk3@cluster0.puw13ji.mongodb.net/?appName=Cluster0
ADMIN_ID=1261889753
JWT_SECRET=your-secret-jwt-key
PORT=5000
```

## 5. Testing

1. Bot'ni toping va `/start` buyrug'ini yuboring
2. Web App tugmasini bosing
3. Web App ochilishi kerak
4. Admin yoki Seller sifatida kirish kerak

## 6. Muammolarni Hal Qilish

### Web App ochilmayapti
- URL to'g'ri ekanligini tekshiring
- HTTPS ishlatilayotganligini tekshiring
- Frontend server ishlayotganligini tekshiring

### Authentication ishlamayapti
- Telegram ID to'g'ri olinayotganligini tekshiring
- Backend loglarini tekshiring
- MongoDB ulanganligini tekshiring

### CORS xatosi
- Backend'da CORS sozlanganligini tekshiring
- Frontend URL'ni CORS whitelist'ga qo'shing

## 7. Production Deployment

1. Frontend'ni deploy qiling (Vercel, Netlify)
2. Backend'ni deploy qiling (Heroku, Railway, VPS)
3. Web App URL'ni yangilang
4. Bot'ni test qiling

