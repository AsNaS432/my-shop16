import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts } from '../api/products';

export const loadProducts = createAsyncThunk(
 'products/loadProducts',
 async () => {
   const products = await fetchProducts();
   return products;
 }
);

const productsSlice = createSlice({
 name: 'products',
 initialState: {
   items: [],
   status: 'idle',
   error: null,
   category: 'Все',
   sortBy: 'default',
   searchQuery: '', // Добавляем состояние для поискового запроса
 },
 reducers: {
   setCategory: (state, action) => {
     state.category = action.payload;
   },
   setSortBy: (state, action) => {
     console.log('Current State before setSortBy:', state);
     state.sortBy = action.payload === 'rating' ? 'default' : action.payload; // Remove rating sorting
     console.log('Updated State after setSortBy:', state);
     console.log('Current State before setSortBy:', state);
     state.sortBy = action.payload;
     console.log('Updated State after setSortBy:', state);
   },
   setSearchQuery: (state, action) => {
     state.searchQuery = action.payload;
   },
 },
 extraReducers: (builder) => {
   builder
     .addCase(loadProducts.pending, (state) => {
       state.status = 'loading';
     })
     .addCase(loadProducts.fulfilled, (state, action) => {
       state.status = 'succeeded';
       state.items = action.payload;
     })
     .addCase(loadProducts.rejected, (state, action) => {
       state.status = 'failed';
       state.error = action.error.message;
     });
 },
});

export const { setCategory, setSortBy, setSearchQuery } = productsSlice.actions;
export default productsSlice.reducer;
