import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { forumApi } from '../../api/forumApi';

export const fetchLeaderboard = createAsyncThunk('leaderboard/fetch', async (_, { rejectWithValue }) => {
  try {
    const { leaderboards } = await forumApi.getLeaderboards();
    return leaderboards;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchLeaderboard.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => { state.items = action.payload; state.status = 'succeeded'; })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.status = 'failed'; state.error = action.payload || action.error.message;
      });
  },
});

export default leaderboardSlice.reducer;
