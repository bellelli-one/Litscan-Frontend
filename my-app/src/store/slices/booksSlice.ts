import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import { getSafeImageUrl } from '../../utils/imageUtils'; 
import { BOOKS_MOCK } from '../../api/mock'; 
import type { IBook } from '../../types';

interface BooksState {
    items: IBook[];
    total: number;
    currentBook: IBook | null;
    loading: boolean;
    error: string | null;
}

const initialState: BooksState = {
    items: [],
    total: 0,
    currentBook: null,
    loading: false,
    error: null,
};

// --- Thunk: Получение списка книг ---
export const fetchBooks = createAsyncThunk(
    'books/fetchBooks',
    async (title: string, { rejectWithValue }) => {
        try {
            // 1. Запрос к API (проверь название метода, скорее всего booksList)
            const response = await api.books.booksList({ title });
            
            const rawItems = response.data.items || [];
            
            // 2. Маппинг данных (превращаем ответ бека в наш IBook)
            const mappedItems: IBook[] = Array.isArray(rawItems) 
                ? rawItems.map((item: any) => ({
                    id: item.id ?? 0,
                    title: item.title ?? 'Без названия',
                    text: item.text ?? '',
                    // ВАЖНО: Применяем защиту для картинок (Tauri)
                    image: getSafeImageUrl(item.image), 
                    status: item.status ?? false,
                    
                    // Новые поля из твоего интерфейса
                    avg_word_len: item.avg_word_len ?? 0,
                    lexical_diversity: item.lexical_diversity ?? 0,
                    conjunction_freq: item.conjunction_freq ?? 0,
                    avg_sentence_len: item.avg_sentence_len ?? 0,
                }))
                : [];

            return {
                items: mappedItems,
                total: response.data.total || 0
            };
        } catch (err) {
            // В случае ошибки возвращаем reject, чтобы сработал блок rejected ниже
            return rejectWithValue('Backend unavailable');
        }
    }
);

// --- Thunk: Получение одной книги (Детальный просмотр) ---
export const fetchBookById = createAsyncThunk(
    'books/fetchBookById',
    async (id: string, { rejectWithValue }) => {
        try {
            const bookId = parseInt(id);
            const response = await api.books.booksDetail(bookId);
            
            const data = response.data;
            
            // Маппим данные
            const mappedBook: IBook = {
                id: data.id ?? bookId,
                title: data.title ?? 'Без названия',
                text: data.text ?? '',
                // ВАЖНО: Защита картинки
                image: getSafeImageUrl(data.image),
                status: data.status ?? false,

                // Новые поля
                avg_word_len: data.avg_word_len ?? 0,
                lexical_diversity: data.lexical_diversity ?? 0,
                conjunction_freq: data.conjunction_freq ?? 0,
                avg_sentence_len: data.avg_sentence_len ?? 0,
            };

            return mappedBook;
        } catch (err) {
            return rejectWithValue(id);
        }
    }
);

const booksSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        clearCurrentBook: (state) => {
            state.currentBook = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // === СПИСОК КНИГ ===
            .addCase(fetchBooks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBooks.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items; 
                state.total = action.payload.total;
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.loading = false;
                state.error = 'Backend unavailable';
                
                // ЛОГИКА MOCK (заглушки)
                console.warn('[Redux] Ошибка загрузки списка книг. Используем моки.');
                const filterTitle = (action.meta.arg as string) || '';
                
                // Фильтруем мок-данные
                const filteredMockItems = BOOKS_MOCK.items.filter(book =>
                    book.title.toLowerCase().includes(filterTitle.toLowerCase())
                );
                
                // Не забываем прогнать моки через getSafeImageUrl, если в моках пути относительные
                state.items = filteredMockItems.map(item => ({
                    ...item,
                    image: getSafeImageUrl(item.image)
                }));
                state.total = filteredMockItems.length;
            })

            // === ДЕТАЛЬНАЯ КНИГА ===
            .addCase(fetchBookById.pending, (state) => {
                state.loading = true;
                state.currentBook = null; 
            })
            .addCase(fetchBookById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentBook = action.payload;
            })
            .addCase(fetchBookById.rejected, (state, action) => {
                state.loading = false;
                
                const idStr = action.meta.arg;
                const id = parseInt(idStr);
                console.log(`[Redux] Ошибка загрузки книги ID: ${id}. Ищем в моках...`);

                const book = BOOKS_MOCK.items.find(b => b.id === id);
                if (book) {
                    state.currentBook = {
                        ...book,
                        image: getSafeImageUrl(book.image)
                    };
                } else {
                    state.currentBook = null;
                }
            });
    },
});

export const { clearCurrentBook } = booksSlice.actions;
export default booksSlice.reducer;