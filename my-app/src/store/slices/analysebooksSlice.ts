import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import { logoutUser } from './userSlice';
import { getSafeImageUrl } from '../../utils/imageUtils'; 
import type { 
    DsAnalyseBooksDTO, 
    DsAnalyseBooksUpdateRequest, 
    DsBookToApplicationUpdateRequest 
} from '../../api/Api';


interface OrdersState {
    list: DsAnalyseBooksDTO[];           
    currentOrder: DsAnalyseBooksDTO | null; 
    loading: boolean;
    error: string | null;
    operationSuccess: boolean;  
}

const initialState: OrdersState = {
    list: [],
    currentOrder: null,
    loading: false,
    error: null,
    operationSuccess: false,
};

export const fetchOrdersList = createAsyncThunk(
    'orders/fetchList',
    async (filters: { status?: string; from?: string; to?: string }, { rejectWithValue }) => {
        try {
            const queryArgs: any = {};
            // Если статус 'all' или пустой, не отправляем его
            if (filters.status && filters.status !== 'all') {
                queryArgs.status = filters.status; // Или parseInt, если бэк ждет число
            }
            if (filters.from) queryArgs.from = filters.from;
            if (filters.to) queryArgs.to = filters.to;

            const response = await api.analysebooks.analysebooksList(queryArgs);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.description || 'Ошибка загрузки списка заявок');
        }
    }
);

// --- 2. Получение одной заявки по ID (Детали) ---
export const fetchOrderById = createAsyncThunk(
    'orders/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const appId = parseInt(id);
            const response = await api.analysebooks.analysebooksDetail(appId);
            const data = response.data;

            // Маппим книги, чтобы исправить картинки для Tauri
            const mappedBooks = (data.books || []).map((b) => ({
                ...b,
                image: getSafeImageUrl(b.image),
                // Если картинка лежит глубже, например в b.book_details.image, поправь путь
            }));

            // Возвращаем обновленный объект с правильными картинками
            const mappedOrder: DsAnalyseBooksDTO = {
                ...data,
                books: mappedBooks
            };
            
            return mappedOrder;
        } catch (err: any) {
            return rejectWithValue('Заявка не найдена');
        }
    }
);

// --- 3. Сохранение основных полей заявки (даты, модератор и т.д.) ---
export const updateOrderFields = createAsyncThunk(
    'orders/updateFields',
    async ({ id, data }: { id: number; data: DsAnalyseBooksUpdateRequest }, { rejectWithValue }) => {
        try {
            await api.analysebooks.analysebooksUpdate(id, data);
            return data;
        } catch (err: any) {
            return rejectWithValue('Ошибка сохранения изменений');
        }
    }
);

// --- 4. Обновление описания КНИГИ внутри заявки ---
export const updateBookDescription = createAsyncThunk(
    'orders/updateBookDesc',
    async ({ orderId, bookId, desc }: { orderId: number; bookId: number; desc: string }, { rejectWithValue }) => {
        try {
            const data: DsBookToApplicationUpdateRequest = { description: desc };
            
            await api.analysebooks.booksUpdate(orderId, bookId, data);
            
            return { bookId, desc };
        } catch (err) {
            return rejectWithValue('Не удалось обновить описание книги');
        }
    }
);

// --- 5. Удаление КНИГИ из заявки ---
export const removeBookFromOrder = createAsyncThunk(
    'orders/removeBook',
    async ({ orderId, bookId }: { orderId: number; bookId: number }, { rejectWithValue }) => {
        try {
            await api.analysebooks.booksDelete(orderId, bookId);
            return bookId;
        } catch (err) {
            return rejectWithValue('Ошибка удаления книги из заявки');
        }
    }
);

// --- 6. Сформировать заявку (Отправить / Изменить статус на "Сформирован") ---
export const submitOrder = createAsyncThunk(
    'orders/submit',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.analysebooks.formUpdate(id);
            return id;
        } catch (err: any) {
            return rejectWithValue('Ошибка формирования заявки');
        }
    }
);

// --- 7. Удалить заявку целиком ---
export const deleteOrder = createAsyncThunk(
    'orders/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.analysebooks.analysebooksDelete(id);
            return id;
        } catch (err) {
            return rejectWithValue('Ошибка удаления заявки');
        }
    }
);

// --- 8. (НОВОЕ) Решение модератора (Одобрить/Отклонить) ---
// =========================================================
export const resolveOrder = createAsyncThunk(
    'orders/resolve',
    async ({ id, action }: { id: number; action: 'complete' | 'reject' }, { rejectWithValue }) => {
        try {
            // Отправляем action ("complete" или "reject")
            // Проверь в Api.ts точное название метода. Обычно это resolveUpdate.
            await api.analysebooks.resolveUpdate(id, { action });
            
            return { id, action };
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.description || 'Ошибка при смене статуса');
        }
    }
);

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        resetOperationSuccess: (state) => {
            state.operationSuccess = false;
        },
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Список
            .addCase(fetchOrdersList.pending, (state) => { state.loading = true; })
            .addCase(fetchOrdersList.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload || []; 
            })
            
            // Детали
            .addCase(fetchOrderById.pending, (state) => { state.loading = true; state.currentOrder = null; })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })
            
            // Обновление полей (оптимистичное обновление UI)
            .addCase(updateOrderFields.fulfilled, (state, action) => {
                if (state.currentOrder) {
                    state.currentOrder = { ...state.currentOrder, ...action.payload };
                }
            })
            
            // Обновление описания книги
            .addCase(updateBookDescription.fulfilled, (state, action) => {
                if (state.currentOrder && state.currentOrder.books) {
                    const book = state.currentOrder.books.find(b => b.book_id === action.payload.bookId);
                    if (book) {
                        book.description = action.payload.desc;
                    }
                }
            })
            
            // Удаление книги из списка
            .addCase(removeBookFromOrder.fulfilled, (state, action) => {
                if (state.currentOrder && state.currentOrder.books) {
                    state.currentOrder.books = state.currentOrder.books.filter(b => b.book_id !== action.payload);
                }
            })
            
            // Успешные операции (Form / Delete)
            .addCase(submitOrder.fulfilled, (state) => { state.operationSuccess = true; })
            .addCase(deleteOrder.fulfilled, (state) => { state.operationSuccess = true; })

            .addCase(resolveOrder.fulfilled, (state, action) => {
                // Обновляем статус локально в списке, чтобы не ждать перезагрузки
                const found = state.list.find(item => item.id === action.payload.id);
                if (found) {
                    // 4 = Завершена, 5 = Отклонена
                    found.status = action.payload.action === 'complete' ? 4 : 5;
                }
            })
            
            // Сброс при выходе
            .addCase(logoutUser.fulfilled, () => initialState);
    }
});

export const { resetOperationSuccess, clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;