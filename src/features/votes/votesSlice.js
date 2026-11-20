import { createSlice } from '@reduxjs/toolkit';

const votesSlice = createSlice({
  name: 'votes',
  initialState: { pending: {} },
  reducers: {
    voteStarted(state, action) { state.pending[action.payload] = true; },
    voteFinished(state, action) { delete state.pending[action.payload]; },
  },
});

export const { voteStarted, voteFinished } = votesSlice.actions;
export default votesSlice.reducer;
