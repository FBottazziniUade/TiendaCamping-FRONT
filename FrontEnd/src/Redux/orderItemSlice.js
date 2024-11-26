import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from './accountManagment/axiosInstance';

const URL = 'http://localhost:4002/order-items';

// Fetch all order items (with optional pagination)
export const fetchOrderItems = createAsyncThunk(
    'orderItems/fetchOrderItems',
    async ({ page = 0, size = 10 } = {}, { getState }) => {
        const token = getState().auth.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { page, size },
        };
        const { data } = await axiosInstance.get(URL, config);
        return data.content; // Assuming `data.content` contains the list of order items
    }
);

// Fetch a single order item by ID
export const fetchOrderItemById = createAsyncThunk(
    'orderItems/fetchOrderItemById',
    async (orderItemId, { getState }) => {
        const token = getState().auth.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const { data } = await axiosInstance.get(`${URL}/${orderItemId}`, config);
        return data;
    }
);

// Create a new order item
export const createOrderItem = createAsyncThunk(
    'orderItems/createOrderItem',
    async (orderItemRequest, { getState }) => {
        const token = getState().auth.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const { data } = await axiosInstance.post(URL, orderItemRequest, config);
        return data;
    }
);

const orderItemSlice = createSlice({
    name: 'orderItems',
    initialState: {
        items: {}, // Store order items by ID
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all order items
            .addCase(fetchOrderItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderItems.fulfilled, (state, action) => {
                state.loading = false;
                action.payload.forEach((orderItem) => {
                    state.items[orderItem.id] = orderItem;
                });
            })
            .addCase(fetchOrderItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch order item by ID
            .addCase(fetchOrderItemById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderItemById.fulfilled, (state, action) => {
                state.loading = false;
                state.items[action.payload.id] = action.payload;
            })
            .addCase(fetchOrderItemById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Create order item
            .addCase(createOrderItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrderItem.fulfilled, (state, action) => {
                state.loading = false;
                state.items[action.payload.id] = action.payload;
            })
            .addCase(createOrderItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default orderItemSlice.reducer;
