import { configureStore } from '@reduxjs/toolkit';

// Импортируем твои актуальные слайсы
import filterReducer from './slices/filterSlice';
import booksReducer from './slices/booksSlice';   // Было factorsSlice
import cartReducer from './slices/cartSlice';     
import userReducer from './slices/userSlice';
import ordersReducer from './slices/analysebooksSlice'; // Было fraxSlice

export const store = configureStore({
    reducer: {
        filter: filterReducer,
        books: booksReducer,      // Теперь состояние книг лежит в state.books
        cart: cartReducer, 
        user: userReducer,
        orders: ordersReducer,    // Заявки лежат в state.orders
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;