import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };


  export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
      try {
        const response = await axios.post('http://localhost:3001/register', userData); // API de registro
        return response.data; // Datos del usuario y token
      } catch (error) {
        console.log(error.response.data)
        return rejectWithValue(error.response.data);
      }
    }
  );


  export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
      try {
        const response = await axios.post('http://localhost:3001/login', credentials); // API de login
        return response.data; // Datos del usuario y token
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );


  export const logoutUser = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
    dispatch(logout());
  });


  const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      logout(state) {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      },
      clearError(state) {
        state.error = null; // Limpia el error
      }
    },
    extraReducers: (builder) => {
      builder
        // Registro
        .addCase(registerUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        })
        .addCase(registerUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Error al registrar';
        })
        // Inicio de sesión
        .addCase(loginUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Error al iniciar sesión';
        })
        // Cierre de sesión
        .addCase(logoutUser.fulfilled, (state) => {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        });
    },
  });
  
  export const { logout, clearError } = authSlice.actions;
  export default authSlice.reducer;