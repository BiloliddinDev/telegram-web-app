# API Serverless Function

Bu fayl Vercel Serverless Function sifatida ishlaydi va backend routes'larini ishga tushiradi.

## Struktura

- `api/index.js` - Serverless function entry point
- Backend routes'lar `backend/routes/` papkasida
- Models `backend/models/` papkasida

## Muhim Eslatma

Telegram Bot polling Vercel Serverless Functions'da ishlamaydi chunki:
- Serverless functions faqat request bo'lganda ishga tushadi
- Polling doimiy connection talab qiladi

**Yechimlar:**
1. Bot'ni alohida server'da ishga tushirish (Railway, Render, VPS)
2. Webhook ishlatish (recommended)
3. Bot funksiyasini olib tashlash va faqat API ishlatish

