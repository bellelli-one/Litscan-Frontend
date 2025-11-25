import type { IPaginatedBooks, IBook, ICartBadge } from '../types';
import { BOOKS_MOCK } from './mock.ts';
import { getApiBase, getImageBase} from '../config';

const API_BASE = getApiBase();
const getSafeImageUrl = (backendUrl: string | null | undefined): string => {
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

// Получение списка книг с фильтрацией по названию
export const getBooks = async (searchQuery: string): Promise<IPaginatedBooks> => {
    const url = searchQuery 
        ? `${API_BASE}/books?title=${encodeURIComponent(searchQuery)}`
        : `${API_BASE}/books`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Backend is not available');
        }
        const data = await response.json();
        const fixedItems = (data.items || []).map((book: any) => ({
            ...book,
            image: getSafeImageUrl(book.image)  // Исправляем ссылку
        }));
        return {
            items: fixedItems,
            total: data.total || 0
        };
    } catch (error) {
        console.warn('Failed to fetch from backend, using mock data.', error);
        const filteredMockItems = BOOKS_MOCK.items.filter(book =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return { items: filteredMockItems, total: filteredMockItems.length };
    }
};

// Получение одной книги по ID
export const getBookById = async (id: string): Promise<IBook | null> => {
    try {
        const response = await fetch(`${API_BASE}/books/${id}`);
        if (!response.ok) {
            throw new Error('Backend is not available');
        }
        const rawBook = await response.json();
        return {
            ...rawBook,
            image: getSafeImageUrl(rawBook.image) 
        };
    } catch (error) {
        console.warn(`Failed to fetch book ${id}, using mock data.`, error);
        const book = BOOKS_MOCK.items.find(b => b.id === parseInt(id));
        return book || null;
    }
};

// Получение корзины
export const getCartBadge = async (): Promise<ICartBadge> => {
    try {
        const token = localStorage.getItem('authToken'); 
        if (!token) {
            throw new Error('No auth token found');
        }

        const response = await fetch(`${API_BASE}/order/cartbadge`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch cart data');
        }
        return await response.json();

    } catch (error) {
        console.warn('Could not fetch cart data, assuming cart is empty.', error);
        return { appl_id: null, count: 0 };
    }
};
