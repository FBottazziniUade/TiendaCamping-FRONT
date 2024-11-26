import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from './accountManagment/axiosInstance';

const URL = 'http://localhost:4002/images';

// Fetch a single image by ID
export const fetchImages = createAsyncThunk('images/fetchImage', async (imageId, { getState }) => {
    const token = getState().auth.token;
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const { data } = await axiosInstance.get(`${URL}/${imageId}`, config);
    return { imageId, file: data.file }; // Assuming file is the base64 string
});



export const createImage = createAsyncThunk('images/createImage', async (newImage) => {
    try {
      const formData = new FormData();
      formData.append("file", newImage);
  
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure it's set to multipart/form-data
        },
      };
  
      const { data } = await axiosInstance.post(URL, formData, config);
      console.log('Image uploaded successfully:', data); // Check the response data
  
      return data.imageId; // Return only the image ID from the response
    } catch (error) {
      console.error('Error uploading image:', error.message);
      throw error;
    }
  });
  
  
  

const imageSlice = createSlice({
    name: 'images',
    initialState: {
        items: {}, // Store images by ID
        loading: false,
        error: null,
        id: 0,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchImages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchImages.fulfilled, (state, action) => {
                const { imageId, file } = action.payload;
                state.loading = false;
                state.items[imageId] = file;
            })
            .addCase(fetchImages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Handle createImage
            .addCase(createImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createImage.fulfilled, (state, action) => {
                state.loading = false;
                state.id = action.payload;
            })
            .addCase(createImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default imageSlice.reducer;
