// config.ts

// IP вашего Go бэкенда.
const BACKEND_IP = 'http://192.168.74.1:8090'; 
const MINIO_IP = 'http://192.168.74.1:9000';

export const getApiBase = (): string => {
    // Vite предоставляет надежный флаг import.meta.env.DEV
    // Он true при 'npm run tauri dev' и false при 'npm run tauri build'
    if (import.meta.env.DEV) {
        return '/api';
    }

    // В сборке (build) всегда возвращаем полный путь
    return `${BACKEND_IP}/api`;
};

export const getImageBase = (): string => {
    if (import.meta.env.DEV) {
        return '/img';
    }
    // В сборке прямой путь
    return MINIO_IP;
};