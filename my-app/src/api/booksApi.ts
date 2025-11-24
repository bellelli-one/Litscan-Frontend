import type { IPaginatedBooks, IBook, ICartBadge } from '../types';
import { BOOKS_MOCK } from './mock.ts';
import { getApiBase } from '../config';

const API_BASE = getApiBase();


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
        return {
            items: data.items || [],
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
        return await response.json();
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
