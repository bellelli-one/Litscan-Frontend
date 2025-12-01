import { Api } from './Api';
import { getApiBase } from '../config'; // Импортируй свою функцию!

// 1. Используем динамический URL (чтобы работало и в Web, и в Tauri)
export const api = new Api({
    baseURL: getApiBase(), // <-- ВМЕСТО '/api' пишем это
});

// 2. Добавляем перехватчик (Interceptor) как у друга
// Он автоматически вставляет токен во все запросы
api.instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    // Проверяем, что headers существуют, чтобы TS не ругался
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});