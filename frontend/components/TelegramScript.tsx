"use client";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: unknown;
    };
  }
}

import { useEffect } from "react";

export default function TelegramScript() {
  useEffect(() => {
    // Load Telegram WebApp script if not already loaded
    if (typeof window !== "undefined" && !window.Telegram?.WebApp) {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-web-app.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return null;
}

