import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from './accountManagment/axiosInstance';

const URL = 'http://localhost:4002/orders';

// Fetch all orders
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { getState }) => {
    const token = getState().auth.token;
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const { data } = await axiosInstance.get(URL, config);
    return data;
});

// Fetch a single order by ID
export const fetchOrderById = createAsyncThunk('orders/fetchOrderById', async (orderId, { getState }) => {
    const token = getState().auth.token;
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const { data } = await axiosInstance.get(`${URL}/${orderId}`, config);
    return data;
});

// Create a new order
export const createOrder = createAsyncThunk('orders/createOrder', async (newOrder, { getState }) => {
    const token = getState().auth.token;
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const { data } = await axiosInstance.post(URL, newOrder, config);
    return data;
});

// Update an order
export const updateOrder = createAsyncThunk('orders/updateOrder', async ({ id, orderDetails }, { getState }) => {
    const token = getState().auth.token;
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const { data } = await axiosInstance.put(`${URL}/${id}`, orderDetails, config);
    return data;
});

// Delete an order
export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (orderId, { getState }) => {
    const token = getState().auth.token;
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    await axiosInstance.delete(`${URL}/${orderId}`, config);
    return orderId;
});

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        items: {}, // Store orders by ID
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all orders
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                action.payload.forEach(order => {
                    state.items[order.id] = order;
                });
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch order by ID
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.items[action.payload.id] = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Create order
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.items[action.payload.id] = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Update order
            .addCase(updateOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.items[action.payload.id] = action.payload;
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Delete order
            .addCase(deleteOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                delete state.items[action.payload];
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default orderSlice.reducer;
