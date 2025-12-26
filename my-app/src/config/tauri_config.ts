const target_tauri = typeof window !== 'undefined' && (window as any).__TAURI__;
// Проверяем, находимся ли мы в режиме продакшена (финальной сборки)
const is_production = import.meta.env.PROD; 

export const api_proxy_addr = "http://192.168.74.1"; // Ваш IP
export const img_proxy_addr = "http://192.168.74.1"; // Ваш IP

// --- ГЛАВНОЕ ИЗМЕНЕНИЕ ЗДЕСЬ ---

// Используем прямой адрес ТОЛЬКО если это Tauri И это финальная сборка (build).
// Во всех остальных случаях (Dev-режим, Браузер) используем прокси '/api'.
export const dest_api = (target_tauri && is_production) ? api_proxy_addr : "/api";

// То же самое для картинок.
// В режиме Dev запрос пойдет на https://localhost:3000/img/..., 
// и Vite перенаправит его на http сервер. Браузер будет доволен (везде HTTPS).
export const dest_img = (target_tauri && is_production) ? img_proxy_addr : "/img";


// Логика для локальных путей (public) остается прежней
export const dest_root = (target_tauri && is_production) ? "/" : import.meta.env.BASE_URL;