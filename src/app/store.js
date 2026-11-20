import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import threadsReducer from '../features/threads/threadsSlice';
import detailReducer from '../features/detail/detailSlice';
import leaderboardReducer from '../features/leaderboard/leaderboardSlice';
import uiReducer from '../features/ui/uiSlice';
import votesReducer from '../features/votes/votesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    detail: detailReducer,
    leaderboard: leaderboardReducer,
    ui: uiReducer,
    votes: votesReducer,
  },
});
