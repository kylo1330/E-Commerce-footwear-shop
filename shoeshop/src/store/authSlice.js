// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isSuperuser: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload.user;
            state.isSuperuser = action.payload.isSuperuser;
        },
        removeUser(state) {
            state.user = null;
            state.isSuperuser = false;
        },
        setUserFromLocalStorage(state, action) {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                state.user = storedUser;
                state.isSuperuser = storedUser.isSuperuser;
            }
        }
    }
});

export const { setUser, removeUser, setUserFromLocalStorage } = authSlice.actions;

export default authSlice.reducer;
