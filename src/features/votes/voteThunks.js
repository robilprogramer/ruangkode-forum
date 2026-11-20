import { forumApi } from '../../api/forumApi';
import { optimisticThreadVote, restoreThreadVote } from '../threads/threadsSlice';
import {
  optimisticDetailThreadVote, restoreDetailThreadVote,
  optimisticCommentVote, restoreCommentVote,
} from '../detail/detailSlice';
import { showToast } from '../ui/uiSlice';
import { voteFinished, voteStarted } from './votesSlice';

/** API is called only by Redux thunks; votes are applied immediately, then rolled back on error. */
export const voteOnThread = (threadId, direction) => async (dispatch, getState) => {
  const { auth, threads, detail, votes } = getState();
  const userId = auth.user?.id;
  const key = `thread:${threadId}`;
  if (!userId || !auth.token || votes.pending[key]) return;
  const item = threads.items.find((thread) => thread.id === threadId);
  const visibleDetail = detail.thread?.id === threadId ? detail.thread : null;
  const target = visibleDetail || item;
  if (!target) return;
  const savedVotes = { upVotesBy: [...(target.upVotesBy || [])], downVotesBy: [...(target.downVotesBy || [])] };
  const actualDirection = (direction === 'up' && savedVotes.upVotesBy.includes(userId))
    || (direction === 'down' && savedVotes.downVotesBy.includes(userId)) ? 'neutral' : direction;
  const vote = { threadId, userId, direction: actualDirection };
  dispatch(voteStarted(key));
  dispatch(optimisticThreadVote(vote));
  dispatch(optimisticDetailThreadVote(vote));
  try {
    await forumApi.voteThread(threadId, actualDirection, auth.token);
  } catch (error) {
    dispatch(restoreThreadVote({ threadId, ...savedVotes }));
    dispatch(restoreDetailThreadVote({ threadId, ...savedVotes }));
    dispatch(showToast({ type: 'error', message: error.message }));
  } finally {
    dispatch(voteFinished(key));
  }
};

export const voteOnComment = (threadId, commentId, direction) => async (dispatch, getState) => {
  const { auth, detail, votes } = getState();
  const userId = auth.user?.id;
  const key = `comment:${commentId}`;
  if (!userId || !auth.token || votes.pending[key]) return;
  const comment = detail.thread?.id === threadId
    ? detail.thread.comments.find((item) => item.id === commentId) : null;
  if (!comment) return;
  const savedVotes = { upVotesBy: [...(comment.upVotesBy || [])], downVotesBy: [...(comment.downVotesBy || [])] };
  const actualDirection = (direction === 'up' && savedVotes.upVotesBy.includes(userId))
    || (direction === 'down' && savedVotes.downVotesBy.includes(userId)) ? 'neutral' : direction;
  dispatch(voteStarted(key));
  dispatch(optimisticCommentVote({ threadId, commentId, userId, direction: actualDirection }));
  try {
    await forumApi.voteComment(threadId, commentId, actualDirection, auth.token);
  } catch (error) {
    dispatch(restoreCommentVote({ threadId, commentId, ...savedVotes }));
    dispatch(showToast({ type: 'error', message: error.message }));
  } finally {
    dispatch(voteFinished(key));
  }
};
