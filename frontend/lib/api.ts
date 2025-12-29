import axios from "axios";

// Vercel'da backend va frontend bir domain'da, shuning uchun relative path ishlatamiz
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" ? "/api" : "http://localhost:5000/api");

// Wait for Telegram WebApp script to load
export const waitForTelegram = (): Promise<any> => {
	return new Promise((resolve) => {
		if (typeof window === "undefined") {
			resolve(null);
			return;
		}

		// Check if already loaded
		if ((window as any).Telegram?.WebApp) {
			resolve((window as any).Telegram.WebApp);
			return;
		}

		// Wait for script to load
		const checkTelegram = setInterval(() => {
			if ((window as any).Telegram?.WebApp) {
				clearInterval(checkTelegram);
				resolve((window as any).Telegram.WebApp);
			}
		}, 100);

		// Timeout after 3 seconds
		setTimeout(() => {
			clearInterval(checkTelegram);
			resolve(null);
		}, 3000);
	});
};

// Get Telegram WebApp data
export const getTelegramData = () => {
	if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
		return (window as any).Telegram.WebApp;
	}
	return null;
};

// Get Telegram user ID
export const getTelegramUserId = (): string | null => {
	const webApp = getTelegramData();
	if (webApp?.initDataUnsafe?.user?.id) {
		return webApp.initDataUnsafe.user.id.toString();
	}

	// Fallback: try to get from initData
	if (webApp?.initData) {
		try {
			const params = new URLSearchParams(webApp.initData);
			const userStr = params.get("user");
			if (userStr) {
				const user = JSON.parse(decodeURIComponent(userStr));
				return user.id?.toString() || null;
			}
		} catch (e) {
			console.error("Error parsing initData:", e);
		}
	}

	return null;
};

// Create axios instance with default config
const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Add request interceptor to include Telegram ID
api.interceptors.request.use(
	(config) => {
		const telegramId = getTelegramUserId();
		if (telegramId) {
			config.headers["x-telegram-id"] = telegramId;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Add response interceptor for error handling
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Handle unauthorized access
			console.error("Unauthorized access");
		} else if (error.response?.status === 403) {
			// Handle forbidden access
			console.error("Forbidden access");
		}
		return Promise.reject(error);
	}
);

export default api;


