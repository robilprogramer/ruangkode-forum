import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { restoreSession } from './features/auth/authSlice';
import SiteLayout from './components/ui/SiteLayout';
import { LoadingState } from './components/ui/StatusViews';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import NewThreadPage from './pages/NewThreadPage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import LeaderboardPage from './pages/LeaderboardPage';
import NotFoundPage from './pages/NotFoundPage';

function RequireAuth({ children }) {
  const { user, status, token } = useSelector((state) => state.auth);
  const location = useLocation();
  if (status === 'loading' || (token && status === 'idle')) return <LoadingState label="Memeriksa sesi login..." />;
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  return children;
}

function AppRoutes() {
  const dispatch = useDispatch();
  useEffect(() => { dispatch(restoreSession()); }, [dispatch]);
  return <Routes><Route element={<SiteLayout />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/register" element={<AuthPage mode="register" />} />
    <Route path="/threads/:threadId" element={<ThreadDetailPage />} />
    <Route path="/leaderboard" element={<LeaderboardPage />} />
    <Route path="/new" element={<RequireAuth><NewThreadPage /></RequireAuth>} />
    <Route path="*" element={<NotFoundPage />} />
  </Route></Routes>;
}

export default function App() {
  return <BrowserRouter><AppRoutes /></BrowserRouter>;
}
