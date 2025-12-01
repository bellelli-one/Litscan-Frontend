import { getImageBase} from '../config';


export const getSafeImageUrl = (backendUrl: string | null | undefined): string => {
    // 1. ЗАЩИТА: Если картинки нет (null, undefined или пустая строка)
    if (!backendUrl) {
        return ''; // Или верните путь к заглушке: '/assets/placeholder.png'
    }
    
    const base = getImageBase(); 
    
    // 2. Логика для DEV режима (через прокси)
    if (base === '/img') {
        // Вырезаем домен (http://ip:port), оставляем только путь
        const cleanPath = backendUrl.replace(/^https?:\/\/[^/]+/, '');
        
        // Если после вырезания путь стал пустым (странно, но бывает), возвращаем base
        if (!cleanPath) return base;

        // Склеиваем: /img + /путь/к/файлу
        return `${base}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
    }

    // 3. Логика для PROD режима или если путь относительный
    if (!backendUrl.startsWith('http')) {
        return `${base}/${backendUrl}`;
    }

    // Иначе возвращаем полный URL как есть
    return backendUrl;
};