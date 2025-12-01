import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import { logoutUser } from './userSlice';


interface CartState {
    application_id: number | null; // <-- Было frax_id
    count: number;
    loading: boolean;
    error: string | null
}

const initialState: CartState = {
    application_id: null,
    count: 0,
    loading: false,
    error: null,
};

// Получение бейджика (статус корзины/заявки)
export const fetchCartBadge = createAsyncThunk(
    'cart/fetchCartBadge',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.analysebooks.cartList(); 
            return response.data; // TypeScript должен понять, что это DsAnalyseBooksBadgeDTO
        } catch (error) {
            return rejectWithValue('Failed to fetch cart badge');
        }
    }
);

// Добавление фактора в черновик 
export const addBookToDraft = createAsyncThunk(
    'cart/addToDraft',
    async (bookId: number, { dispatch, rejectWithValue }) => {
        try {
            await api.analysebooks.draftBooksCreate(bookId);
            dispatch(fetchCartBadge());
            return bookId;
        } catch (error: any) {
            alert("Ошибка при добавлении: " + (error.response?.data?.description || "Неизвестная ошибка"));
            return rejectWithValue('Failed to add');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Успешная загрузка бейджика
            .addCase(fetchCartBadge.fulfilled, (state, action) => {
                // Используем твои поля из DsAnalyseBooksBadgeDTO
                state.application_id = action.payload.application_id || null;
                state.count = action.payload.count || 0;
                state.loading = false;
            })
            .addCase(fetchCartBadge.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCartBadge.rejected, (state) => {
                state.application_id = null;
                state.count = 0;
                state.loading = false;
            })
            // При выходе пользователя очищаем корзину
            .addCase(logoutUser.fulfilled, () => initialState);
    }
});

export default cartSlice.reducer;