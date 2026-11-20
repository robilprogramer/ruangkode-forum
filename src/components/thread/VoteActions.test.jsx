/**
 * Skenario pengujian komponen VoteActions
 *
 * - VoteActions component
 *   - harus menampilkan jumlah upvote dan downvote
 *   - harus menandai tombol upvote aktif ketika pengguna sudah upvote
 *   - harus mengarahkan ke halaman login ketika tamu menekan tombol vote
 *   - harus memanggil API up-vote thread ketika pengguna login menekan upvote
 *   - harus menonaktifkan tombol ketika request vote sedang berjalan
 */
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { forumApi } from '../../api/forumApi';
import { renderWithProviders } from '../../test/renderWithProviders';
import VoteActions from './VoteActions';

vi.mock('../../api/forumApi', () => ({
  forumApi: { voteThread: vi.fn(), voteComment: vi.fn() },
}));

const thread = { id: 'thread-1', upVotesBy: ['user-1', 'user-2'], downVotesBy: ['user-3'] };
const user = { id: 'user-1', name: 'Dicoding' };

const loggedInState = (overrides = {}) => ({
  auth: { token: 'token-123', user, status: 'succeeded', error: null },
  threads: {
    items: [thread], users: [], status: 'succeeded', error: null, createStatus: 'idle', createError: null,
  },
  votes: { pending: {} },
  ...overrides,
});

describe('VoteActions component', () => {
  beforeEach(() => vi.resetAllMocks());

  it('should display the upvote and downvote counts', () => {
    renderWithProviders(<VoteActions item={thread} type="thread" threadId="thread-1" />);

    expect(screen.getByRole('button', { name: 'Upvote' })).toHaveTextContent('2');
    expect(screen.getByRole('button', { name: 'Downvote' })).toHaveTextContent('1');
  });

  it('should mark the upvote button as pressed when the user has upvoted', () => {
    renderWithProviders(
      <VoteActions item={thread} type="thread" threadId="thread-1" />,
      { preloadedState: loggedInState() },
    );

    expect(screen.getByRole('button', { name: 'Upvote' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Downvote' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('should redirect to the login page when a guest clicks a vote button', async () => {
    renderWithProviders(<VoteActions item={thread} type="thread" threadId="thread-1" />);

    await userEvent.click(screen.getByRole('button', { name: 'Upvote' }));

    expect(screen.getByText('Halaman login')).toBeInTheDocument();
    expect(forumApi.voteThread).not.toHaveBeenCalled();
  });

  it('should call the thread up-vote API when a logged-in user clicks upvote', async () => {
    forumApi.voteThread.mockResolvedValue({});
    const item = { ...thread, upVotesBy: ['user-2'] };
    const state = loggedInState();
    state.threads.items = [item];
    renderWithProviders(
      <VoteActions item={item} type="thread" threadId="thread-1" />,
      { preloadedState: state },
    );

    await userEvent.click(screen.getByRole('button', { name: 'Upvote' }));

    await waitFor(() => expect(forumApi.voteThread).toHaveBeenCalledWith('thread-1', 'up', 'token-123'));
  });

  it('should disable the buttons while a vote request is pending', () => {
    renderWithProviders(
      <VoteActions item={thread} type="thread" threadId="thread-1" />,
      { preloadedState: loggedInState({ votes: { pending: { 'thread:thread-1': true } } }) },
    );

    expect(screen.getByRole('button', { name: 'Upvote' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Downvote' })).toBeDisabled();
  });
});
