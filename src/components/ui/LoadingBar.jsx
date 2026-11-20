import { useSelector } from 'react-redux';

export default function LoadingBar() {
  const busy = useSelector((state) => [state.auth.status, state.threads.status,
    state.threads.createStatus, state.detail.status, state.detail.commentStatus,
    state.leaderboard.status].includes('loading'));
  return <div aria-hidden="true" className={`loading-bar ${busy ? 'loading-bar--active' : ''}`}><span /></div>;
}
