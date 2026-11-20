import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { voteOnThread, voteOnComment } from '../../features/votes/voteThunks';
import Icon from '../ui/Icon';

export default function VoteActions({ item, type, threadId, vertical = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const pending = useSelector((state) => !!state.votes.pending[`${type}:${item.id}`]);
  const up = item.upVotesBy || [];
  const down = item.downVotesBy || [];
  const upActive = !!user && up.includes(user.id);
  const downActive = !!user && down.includes(user.id);

  const handleVote = (direction) => {
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(location.pathname)}`);
      return;
    }
    if (type === 'thread') dispatch(voteOnThread(threadId, direction));
    else dispatch(voteOnComment(threadId, item.id, direction));
  };

  return <div className={`votes ${vertical ? 'votes--vertical' : ''}`} aria-label="Voting">
    <button type="button" className={`vote-btn ${upActive ? 'vote-btn--active' : ''}`}
      onClick={() => handleVote('up')} disabled={pending} aria-label="Upvote" aria-pressed={upActive} title="Upvote">
      <Icon name="thumbsUp" size={17} /><span>{up.length}</span>
    </button>
    <button type="button" className={`vote-btn ${downActive ? 'vote-btn--down' : ''}`}
      onClick={() => handleVote('down')} disabled={pending} aria-label="Downvote" aria-pressed={downActive} title="Downvote">
      <Icon name="thumbsDown" size={17} /><span>{down.length}</span>
    </button>
  </div>;
}
