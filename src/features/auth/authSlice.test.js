/**
 * Skenario pengujian authReducer
 *
 * - authReducer function
 *   - harus mengembalikan initial state ketika menerima action yang tidak dikenal
 *   - harus mengubah status menjadi loading dan menghapus error ketika login pending
 *   - harus menyimpan token dan user ketika login fulfilled
 *   - harus menyimpan pesan error ketika login rejected
 *   - harus menghapus token dan user ketika menerima action logout
 *
 * - loginUser thunk
 *   - harus memanggil API login dan getMe lalu men-dispatch action fulfilled dengan token & user
 *   - harus menyimpan token ke localStorage ketika login berhasil
 *   - harus men-dispatch action rejected dengan pesan error ketika API login gagal
 *
 * - registerUser thunk
 *   - harus mendaftar, login otomatis, lalu men-dispatch action fulfilled
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { forumApi } from '../../api/forumApi';
import reducer, { loginUser, logout, registerUser } from './authSlice';

vi.mock('../../api/forumApi', () => ({
  forumApi: { login: vi.fn(), getMe: vi.fn(), register: vi.fn() },
}));

const fakeUser = { id: 'user-1', name: 'Dicoding', email: 'dicoding@mail.com', avatar: '' };
const initialState = { token: null, user: null, status: 'idle', error: null };

describe('authReducer function', () => {
  it('should return the initial state when given an unknown action', () => {
    expect(reducer(initialState, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('should set status to loading and clear error when login is pending', () => {
    const state = reducer({ ...initialState, error: 'lama' }, { type: loginUser.pending.type });
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('should store token and user when login is fulfilled', () => {
    const state = reducer(initialState, {
      type: loginUser.fulfilled.type,
      payload: { token: 'token-123', user: fakeUser },
    });
    expect(state).toEqual({ token: 'token-123', user: fakeUser, status: 'succeeded', error: null });
  });

  it('should store the error message when login is rejected', () => {
    const state = reducer(initialState, {
      type: loginUser.rejected.type,
      payload: 'email or password is wrong',
    });
    expect(state.status).toBe('failed');
    expect(state.error).toBe('email or password is wrong');
  });

  it('should clear token and user when given logout action', () => {
    const loggedIn = { token: 'token-123', user: fakeUser, status: 'succeeded', error: null };
    expect(reducer(loggedIn, logout())).toEqual(initialState);
  });
});

describe('loginUser thunk', () => {
  beforeEach(() => vi.resetAllMocks());

  it('should call login & getMe then dispatch fulfilled action with token and user', async () => {
    forumApi.login.mockResolvedValue({ token: 'token-123' });
    forumApi.getMe.mockResolvedValue({ user: fakeUser });
    const dispatch = vi.fn();

    await loginUser({ email: fakeUser.email, password: 'secret' })(dispatch, () => ({}), undefined);

    expect(forumApi.login).toHaveBeenCalledWith({ email: fakeUser.email, password: 'secret' });
    expect(forumApi.getMe).toHaveBeenCalledWith('token-123');
    const types = dispatch.mock.calls.map(([action]) => action.type);
    expect(types).toEqual([loginUser.pending.type, loginUser.fulfilled.type]);
    expect(dispatch.mock.calls[1][0].payload).toEqual({ token: 'token-123', user: fakeUser });
  });

  it('should save the token to localStorage when login succeeds', async () => {
    forumApi.login.mockResolvedValue({ token: 'token-123' });
    forumApi.getMe.mockResolvedValue({ user: fakeUser });

    await loginUser({ email: fakeUser.email, password: 'secret' })(vi.fn(), () => ({}), undefined);

    expect(localStorage.getItem('ruangkode:token')).toBe('token-123');
  });

  it('should dispatch rejected action with the error message when login fails', async () => {
    forumApi.login.mockRejectedValue(new Error('email or password is wrong'));
    const dispatch = vi.fn();

    await loginUser({ email: fakeUser.email, password: 'salah' })(dispatch, () => ({}), undefined);

    const rejected = dispatch.mock.calls[1][0];
    expect(rejected.type).toBe(loginUser.rejected.type);
    expect(rejected.payload).toBe('email or password is wrong');
    expect(forumApi.getMe).not.toHaveBeenCalled();
  });
});

describe('registerUser thunk', () => {
  beforeEach(() => vi.resetAllMocks());

  it('should register, log in automatically, then dispatch fulfilled action', async () => {
    forumApi.register.mockResolvedValue({ user: fakeUser });
    forumApi.login.mockResolvedValue({ token: 'token-456' });
    forumApi.getMe.mockResolvedValue({ user: fakeUser });
    const dispatch = vi.fn();
    const values = { name: 'Dicoding', email: fakeUser.email, password: 'secret' };

    await registerUser(values)(dispatch, () => ({}), undefined);

    expect(forumApi.register).toHaveBeenCalledWith(values);
    expect(forumApi.login).toHaveBeenCalledWith({ email: values.email, password: values.password });
    expect(dispatch.mock.calls[1][0]).toMatchObject({
      type: registerUser.fulfilled.type,
      payload: { token: 'token-456', user: fakeUser },
    });
  });
});
