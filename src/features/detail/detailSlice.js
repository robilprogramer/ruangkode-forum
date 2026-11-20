import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { forumApi } from '../../api/forumApi';
import { nextVotes } from '../threads/threadsSlice';

export const fetchThread = createAsyncThunk('detail/fetch', async (threadId, { rejectWithValue }) => {
  try {
    const { detailThread } = await forumApi.getThread(threadId);
    return detailThread;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const publishComment = createAsyncThunk('detail/comment', async ({ threadId, content }, {
  getState, dispatch, rejectWithValue,
}) => {
  try {
    await forumApi.createComment(threadId, content, getState().auth.token);
    await dispatch(fetchThread(threadId)).unwrap();
    return true;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const detailSlice = createSlice({
  name: 'detail',
  initialState: { thread: null, status: 'idle', error: null, commentStatus: 'idle', commentError: null },
  reducers: {
    optimisticDetailThreadVote(state, action) {
      if (state.thread?.id === action.payload.threadId) {
        const { userId, direction } = action.payload;
        Object.assign(state.thread, nextVotes(state.thread.upVotesBy, state.thread.downVotesBy, userId, direction));
      }
    },
    restoreDetailThreadVote(state, action) {
      if (state.thread?.id === action.payload.threadId) {
        state.thread.upVotesBy = action.payload.upVotesBy;
        state.thread.downVotesBy = action.payload.downVotesBy;
      }
    },
    optimisticCommentVote(state, action) {
      const { threadId, commentId, userId, direction } = action.payload;
      if (state.thread?.id !== threadId) return;
      const comment = state.thread.comments.find((item) => item.id === commentId);
      if (comment) Object.assign(comment, nextVotes(comment.upVotesBy, comment.downVotesBy, userId, direction));
    },
    restoreCommentVote(state, action) {
      const { threadId, commentId, upVotesBy, downVotesBy } = action.payload;
      if (state.thread?.id !== threadId) return;
      const comment = state.thread.comments.find((item) => item.id === commentId);
      if (comment) Object.assign(comment, { upVotesBy, downVotesBy });
    },
    resetDetail(state) { state.thread = null; state.status = 'idle'; state.error = null; },
    clearCommentError(state) { state.commentError = null; },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchThread.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchThread.fulfilled, (state, action) => { state.status = 'succeeded'; state.thread = action.payload; })
      .addCase(fetchThread.rejected, (state, action) => {
        state.status = 'failed'; state.error = action.payload || action.error.message;
      })
      .addCase(publishComment.pending, (state) => { state.commentStatus = 'loading'; state.commentError = null; })
      .addCase(publishComment.fulfilled, (state) => { state.commentStatus = 'succeeded'; })
      .addCase(publishComment.rejected, (state, action) => {
        state.commentStatus = 'failed'; state.commentError = action.payload || action.error.message;
      });
  },
});

export const {
  optimisticDetailThreadVote, restoreDetailThreadVote, optimisticCommentVote,
  restoreCommentVote, resetDetail, clearCommentError,
} = detailSlice.actions;
export default detailSlice.reducer;
