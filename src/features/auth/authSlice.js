import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { forumApi } from '../../api/forumApi';

const TOKEN_KEY = 'ruangkode:token';
const getSavedToken = () => (typeof localStorage === 'undefined' ? null : localStorage.getItem(TOKEN_KEY));

export const restoreSession = createAsyncThunk('auth/restore', async (_, { rejectWithValue }) => {
  const token = getSavedToken();
  if (!token) return null;
  try {
    const { user } = await forumApi.getMe(token);
    return { user, token };
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return rejectWithValue(error.message);
  }
});

export const loginUser = createAsyncThunk('auth/login', async (values, { rejectWithValue }) => {
  try {
    const { token } = await forumApi.login(values);
    const { user } = await forumApi.getMe(token);
    localStorage.setItem(TOKEN_KEY, token);
    return { token, user };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (values, { rejectWithValue }) => {
  try {
    await forumApi.register(values);
    const { token } = await forumApi.login({ email: values.email, password: values.password });
    const { user } = await forumApi.getMe(token);
    localStorage.setItem(TOKEN_KEY, token);
    return { user, token };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: getSavedToken(), user: null, status: 'idle', error: null },
  reducers: {
    logout(state) {
      localStorage.removeItem(TOKEN_KEY);
      state.token = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
    clearAuthError(state) { state.error = null; },
  },
  extraReducers(builder) {
    builder
      .addCase(restoreSession.pending, (state) => { state.status = 'loading'; })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload?.token || null;
        state.user = action.payload?.user || null;
      })
      .addCase(restoreSession.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
    for (const thunk of [loginUser, registerUser]) {
      builder
        .addCase(thunk.pending, (state) => { state.status = 'loading'; state.error = null; })
        .addCase(thunk.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.token = action.payload.token;
          state.user = action.payload.user;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload || action.error.message;
        });
    }
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
