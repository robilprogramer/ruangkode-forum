import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { forumApi } from '../../api/forumApi';

export const fetchOverview = createAsyncThunk('threads/fetchOverview', async (_, { rejectWithValue }) => {
  try {
    const [threadsData, usersData] = await Promise.all([forumApi.getThreads(), forumApi.getUsers()]);
    return { threads: threadsData.threads, users: usersData.users };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const publishThread = createAsyncThunk('threads/publish', async (values, { getState, dispatch, rejectWithValue }) => {
  try {
    const { token } = getState().auth;
    const { thread } = await forumApi.createThread(values, token);
    dispatch(fetchOverview());
    return thread;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export function nextVotes(upVotesBy = [], downVotesBy = [], userId, direction) {
  const up = upVotesBy.filter((user) => user !== userId);
  const down = downVotesBy.filter((user) => user !== userId);
  if (direction === 'up') up.push(userId);
  if (direction === 'down') down.push(userId);
  return { upVotesBy: up, downVotesBy: down };
}

const threadsSlice = createSlice({
  name: 'threads',
  initialState: { items: [], users: [], status: 'idle', error: null, createStatus: 'idle', createError: null },
  reducers: {
    optimisticThreadVote(state, action) {
      const { threadId, userId, direction } = action.payload;
      const thread = state.items.find((item) => item.id === threadId);
      if (thread) Object.assign(thread, nextVotes(thread.upVotesBy, thread.downVotesBy, userId, direction));
    },
    restoreThreadVote(state, action) {
      const { threadId, upVotesBy, downVotesBy } = action.payload;
      const thread = state.items.find((item) => item.id === threadId);
      if (thread) Object.assign(thread, { upVotesBy, downVotesBy });
    },
    clearCreateError(state) { state.createError = null; },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOverview.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchOverview.fulfilled, (state, action) => {
        state.items = action.payload.threads;
        state.users = action.payload.users;
        state.status = 'succeeded';
      })
      .addCase(fetchOverview.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(publishThread.pending, (state) => { state.createStatus = 'loading'; state.createError = null; })
      .addCase(publishThread.fulfilled, (state) => { state.createStatus = 'succeeded'; })
      .addCase(publishThread.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.payload || action.error.message;
      });
  },
});

export const { optimisticThreadVote, restoreThreadVote, clearCreateError } = threadsSlice.actions;
export default threadsSlice.reducer;
