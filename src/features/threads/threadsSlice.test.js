/**
 * Skenario pengujian threadsReducer (voting thread)
 *
 * - nextVotes function
 *   - harus memindahkan pemilih dari upVotesBy ke downVotesBy tanpa duplikasi
 *   - harus menghapus pemilih dari kedua daftar ketika vote dinetralkan
 *
 * - threadsReducer function
 *   - harus menambahkan id pengguna ke upVotesBy ketika menerima action optimisticThreadVote
 *   - harus mengembalikan voting sebelumnya ketika menerima action restoreThreadVote
 */
import { describe, expect, it } from 'vitest';
import reducer, { nextVotes, optimisticThreadVote, restoreThreadVote } from './threadsSlice';

const thread = {
  id: 'thread-1', title: 'Contoh', category: 'React', body: 'Diskusi', createdAt: '2026-01-01',
  upVotesBy: ['user-1'], downVotesBy: ['user-2'], totalComments: 2,
};
const state = { items: [thread], users: [], status: 'succeeded', error: null, createStatus: 'idle', createError: null };

describe('thread voting reducer', () => {
  it('memindahkan upvote ke downvote tanpa menggandakan pemilih', () => {
    expect(nextVotes(['user-1'], ['user-2'], 'user-1', 'down'))
      .toEqual({ upVotesBy: [], downVotesBy: ['user-2', 'user-1'] });
  });
  it('menghapus voting ketika netral', () => {
    expect(nextVotes(['user-1'], ['user-2'], 'user-2', 'neutral'))
      .toEqual({ upVotesBy: ['user-1'], downVotesBy: [] });
  });
  it('menerapkan optimistic vote di Redux Store', () => {
    const next = reducer(state, optimisticThreadVote({ threadId: 'thread-1', userId: 'user-3', direction: 'up' }));
    expect(next.items[0].upVotesBy).toContain('user-3');
    expect(state.items[0].upVotesBy).not.toContain('user-3');
  });
  it('rollback mengembalikan voting sebelumnya', () => {
    const changed = reducer(state, optimisticThreadVote({ threadId: 'thread-1', userId: 'user-3', direction: 'up' }));
    const restored = reducer(changed, restoreThreadVote({ threadId: 'thread-1', upVotesBy: ['user-1'], downVotesBy: ['user-2'] }));
    expect(restored.items[0]).toEqual(thread);
  });
});
