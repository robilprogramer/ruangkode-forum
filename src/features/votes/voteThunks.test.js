/**
 * Skenario pengujian thunk voting (voteOnThread & voteOnComment)
 *
 * - voteOnThread thunk
 *   - harus men-dispatch voteStarted, optimistic vote, dan voteFinished ketika API berhasil
 *   - harus men-dispatch action rollback dan showToast ketika API gagal
 *   - harus memanggil endpoint neutral ketika pengguna menekan vote yang sudah aktif
 *
 * - voteOnComment thunk
 *   - harus men-dispatch optimisticCommentVote dan memanggil route komentar yang tepat
 *   - harus men-dispatch restoreCommentVote dan showToast ketika API gagal
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { forumApi } from '../../api/forumApi';
import { voteOnThread, voteOnComment } from './voteThunks';

vi.mock('../../api/forumApi', () => ({
  forumApi: { voteThread: vi.fn(), voteComment: vi.fn() },
}));

function makeState() {
  return {
    auth: { token: 'sample-token', user: { id: 'user-1' } },
    threads: { items: [{ id: 'thread-1', upVotesBy: [], downVotesBy: [] }] },
    detail: {
      thread: {
        id: 'thread-1', upVotesBy: [], downVotesBy: [],
        comments: [{ id: 'comment-1', upVotesBy: [], downVotesBy: [] }],
      },
    },
    votes: { pending: {} },
  };
}

const run = (thunk, state = makeState()) => {
  const dispatched = [];
  const dispatch = (action) => { dispatched.push(action); return action; };
  return thunk(dispatch, () => state).then(() => dispatched);
};

beforeEach(() => vi.resetAllMocks());

describe('optimistic voting thunk', () => {
  it('langsung menerapkan vote dan menyelesaikan request API thread', async () => {
    forumApi.voteThread.mockResolvedValue({});
    const actions = await run(voteOnThread('thread-1', 'up'));
    expect(actions.map((action) => action.type)).toEqual([
      'votes/voteStarted', 'threads/optimisticThreadVote',
      'detail/optimisticDetailThreadVote', 'votes/voteFinished',
    ]);
    expect(forumApi.voteThread).toHaveBeenCalledWith('thread-1', 'up', 'sample-token');
  });
  it('rollback voting thread jika API gagal', async () => {
    forumApi.voteThread.mockRejectedValue(new Error('Terputus'));
    const actions = await run(voteOnThread('thread-1', 'up'));
    expect(actions.map((action) => action.type)).toContain('threads/restoreThreadVote');
    expect(actions.map((action) => action.type)).toContain('detail/restoreDetailThreadVote');
    expect(actions.map((action) => action.type)).toContain('ui/showToast');
  });
  it('menggunakan endpoint neutral ketika menekan vote aktif', async () => {
    forumApi.voteThread.mockResolvedValue({});
    const state = makeState();
    state.detail.thread.upVotesBy = ['user-1'];
    await run(voteOnThread('thread-1', 'up'), state);
    expect(forumApi.voteThread).toHaveBeenCalledWith('thread-1', 'neutral', 'sample-token');
  });
  it('optimistic voting komentar menggunakan route yang tepat', async () => {
    forumApi.voteComment.mockResolvedValue({});
    const actions = await run(voteOnComment('thread-1', 'comment-1', 'down'));
    expect(actions.map((action) => action.type)).toContain('detail/optimisticCommentVote');
    expect(forumApi.voteComment).toHaveBeenCalledWith('thread-1', 'comment-1', 'down', 'sample-token');
  });
  it('rollback voting komentar ketika server gagal', async () => {
    forumApi.voteComment.mockRejectedValue(new Error('Gagal'));
    const actions = await run(voteOnComment('thread-1', 'comment-1', 'up'));
    expect(actions.map((action) => action.type)).toContain('detail/restoreCommentVote');
    expect(actions.map((action) => action.type)).toContain('ui/showToast');
  });
});
