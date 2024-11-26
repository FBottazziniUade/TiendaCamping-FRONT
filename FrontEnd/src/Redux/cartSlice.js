import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  discount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    applyCoupon: (state, action) => {
      const validCoupons = { OFERTA10: 10, OFERTA20: 20 };
      state.discount = validCoupons[action.payload] || 0;
    },
    purchaseCart: (state) => {
      // Add logic for saving purchase to backend if needed
      console.log('Purchased items:', state.items);
      state.items = []; // Clear cart after purchase
      state.discount = 0;
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  applyCoupon,
  purchaseCart,
} = cartSlice.actions;

export default cartSlice.reducer;
