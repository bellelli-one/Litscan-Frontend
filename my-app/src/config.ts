// IP вашего Go бэкенда.
const BACKEND_IP = 'http://localhost:8090'; 
const MINIO_IP = 'http://localhost:9000';

export const getApiBase = (): string => {
    // @ts-ignore
    const isTauri = !!window.__TAURI__;

    // Если Tauri - полный путь (прокси в сборке нет).
    // Если браузер - относительный путь (работает через прокси Vite).
    return isTauri ? `${BACKEND_IP}/api` : '/api';
};

export const getImageBase = (): string => {
    // @ts-ignore
    const isTauri = !!window.__TAURI__;
    // Картинки всегда забираем по полному пути
    return isTauri ? `${MINIO_IP}` : 'http://localhost:9000';
};