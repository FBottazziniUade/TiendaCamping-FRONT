import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import registerReducer from './accountManagment/authenticacionSlice';
import imageReducer from './imageSlice';
import cartReducer from './cartSlice';
import categoryReducer from './categorySlice';

export const store = configureStore({
    reducer: {
        products : productReducer,
        auth: registerReducer,
        images: imageReducer,
        cart: cartReducer,
        categories:  categoryReducer,
    }
})