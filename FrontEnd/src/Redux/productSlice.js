import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from './accountManagment/axiosInstance';

const URL = '/products';

// Fetch all products
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
    const { data } = await axiosInstance.get(URL);
    return data.content;
});

// Create a new product
export const createProduct = createAsyncThunk('products/createProduct', async (newProduct) => {
  const token = localStorage.getItem('acces_token'); // Adjust according to your state structure
  const config = {
      headers: {  
          Authorization: `Bearer ${token}`,
      },
  };
    console.log(newProduct)
    const { data } = await axiosInstance.post('http://localhost:4002/products', newProduct, config);
    return data; // Assume the API returns the created product
});

export const editProduct = createAsyncThunk('products/editProduct', async (editProduct) => {
    const { data } = await axiosInstance.put(`${URL}/${editProduct.id}`, editProduct)
    return data;
})

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (productId) => {
    const { data } = await axiosInstance.delete(`${URL}/${productId}`, productId)
})

const productSlice = createSlice({
    name: 'products',
    initialState: {
      products: [],
      loading: false, // Default to false for smoother initial load handling
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        // Handle fetchProducts lifecycle
        .addCase(fetchProducts.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchProducts.fulfilled, (state, action) => {
          state.loading = false;
          state.products = action.payload; // Replace with fetched products
        })
        .addCase(fetchProducts.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })
  
        // Handle createProduct lifecycle
        .addCase(createProduct.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(createProduct.fulfilled, (state, action) => {
          state.loading = false;
          state.products = [...state.products, action.payload]; // Append new product
        })
        .addCase(createProduct.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })
  
        // Handle editProduct
        .addCase(editProduct.fulfilled, (state, action) => {
          state.loading = false;
          const updatedProduct = action.payload;
          state.products = state.products.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          ); // Replace the edited product
        })
        .addCase(editProduct.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })
  
        // Handle deleteProduct
        .addCase(deleteProduct.fulfilled, (state, action) => {
          state.loading = false;
          const deletedProductId = action.meta.arg; // Pass `productId` to the thunk
          state.products = state.products.filter(
            (product) => product.id !== deletedProductId
          ); // Remove the deleted product
        })
        .addCase(deleteProduct.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        });
    },
  });
  
export default productSlice.reducer;
