/** One network boundary for the entire app. React components never call fetch. */
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://forum-api.dicoding.dev/v1').replace(/\/$/, '');
const id = (value) => encodeURIComponent(value);

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function request(path, { method = 'GET', token, body, signal } = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      signal,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new ApiError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.', 0);
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new ApiError('Respons server tidak dapat dibaca.', response.status);
  }
  if (!response.ok || result.status !== 'success') {
    throw new ApiError(result.message || 'Permintaan gagal diproses.', response.status);
  }
  return result.data || {};
}

export const forumApi = {
  register: (payload) => request('/register', { method: 'POST', body: payload }),
  login: (payload) => request('/login', { method: 'POST', body: payload }),
  getMe: (token) => request('/users/me', { token }),
  getUsers: () => request('/users'),
  getThreads: () => request('/threads'),
  getThread: (threadId) => request(`/threads/${id(threadId)}`),
  createThread: (payload, token) => request('/threads', { method: 'POST', body: payload, token }),
  createComment: (threadId, content, token) => request(`/threads/${id(threadId)}/comments`, {
    method: 'POST', body: { content }, token,
  }),
  voteThread: (threadId, direction, token) => request(`/threads/${id(threadId)}/${direction}-vote`, {
    method: 'POST', token,
  }),
  voteComment: (threadId, commentId, direction, token) => request(`/threads/${id(threadId)}/comments/${id(commentId)}/${direction}-vote`, {
    method: 'POST', token,
  }),
  getLeaderboards: () => request('/leaderboards'),
};
