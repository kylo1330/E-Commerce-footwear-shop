// src/store/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // assuming the authSlice file is in the same directory

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers here if any
  },
});

export default store;
