import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import authReducer from '../features/auth/authSlice';
import threadsReducer from '../features/threads/threadsSlice';
import detailReducer from '../features/detail/detailSlice';
import leaderboardReducer from '../features/leaderboard/leaderboardSlice';
import uiReducer from '../features/ui/uiSlice';
import votesReducer from '../features/votes/votesSlice';

export function makeTestStore(preloadedState) {
  return configureStore({
    reducer: {
      auth: authReducer,
      threads: threadsReducer,
      detail: detailReducer,
      leaderboard: leaderboardReducer,
      ui: uiReducer,
      votes: votesReducer,
    },
    preloadedState,
  });
}

export function renderWithProviders(ui, { preloadedState, route = '/', path = '*' } = {}) {
  const store = makeTestStore(preloadedState);
  const result = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={path} element={ui} />
          <Route path="/login" element={<p>Halaman login</p>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
  return { store, ...result };
}
