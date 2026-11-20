/**
 * Skenario pengujian komponen AuthPage (mode login)
 *
 * - AuthPage component
 *   - harus menangani input email dengan benar
 *   - harus menangani input kata sandi dengan benar
 *   - harus memanggil API login dengan email dan kata sandi ketika tombol masuk ditekan
 *   - harus menampilkan toast error tanpa memanggil API ketika kata sandi kurang dari 6 karakter
 *   - harus menampilkan pesan error dari server ketika login gagal
 */
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { forumApi } from '../api/forumApi';
import { renderWithProviders } from '../test/renderWithProviders';
import AuthPage from './AuthPage';

vi.mock('../api/forumApi', () => ({
  forumApi: { login: vi.fn(), getMe: vi.fn(), register: vi.fn() },
}));

const renderLogin = () => renderWithProviders(<AuthPage mode="login" />, { route: '/masuk' });

describe('AuthPage component', () => {
  beforeEach(() => vi.resetAllMocks());

  it('should handle email typing correctly', async () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText('nama@email.com');

    await userEvent.type(emailInput, 'dicoding@mail.com');

    expect(emailInput).toHaveValue('dicoding@mail.com');
  });

  it('should handle password typing correctly', async () => {
    renderLogin();
    const passwordInput = screen.getByPlaceholderText('Minimal 6 karakter');

    await userEvent.type(passwordInput, 'rahasia123');

    expect(passwordInput).toHaveValue('rahasia123');
  });

  it('should call the login API with email and password when the login button is clicked', async () => {
    forumApi.login.mockResolvedValue({ token: 'token-123' });
    forumApi.getMe.mockResolvedValue({ user: { id: 'user-1', name: 'Dicoding' } });
    const { store } = renderLogin();

    await userEvent.type(screen.getByPlaceholderText('nama@email.com'), 'dicoding@mail.com');
    await userEvent.type(screen.getByPlaceholderText('Minimal 6 karakter'), 'rahasia123');
    await userEvent.click(screen.getByRole('button', { name: /masuk sekarang/i }));

    expect(forumApi.login).toHaveBeenCalledWith({ email: 'dicoding@mail.com', password: 'rahasia123' });
    await waitFor(() => expect(store.getState().auth.user).toEqual({ id: 'user-1', name: 'Dicoding' }));
  });

  it('should show an error toast without calling the API when the password is shorter than 6 characters', async () => {
    const { store } = renderLogin();
    const passwordInput = screen.getByPlaceholderText('Minimal 6 karakter');
    passwordInput.removeAttribute('minLength');

    await userEvent.type(screen.getByPlaceholderText('nama@email.com'), 'dicoding@mail.com');
    await userEvent.type(passwordInput, '123');
    await userEvent.click(screen.getByRole('button', { name: /masuk sekarang/i }));

    expect(forumApi.login).not.toHaveBeenCalled();
    expect(store.getState().ui.toast).toEqual({ type: 'error', message: 'Kata sandi minimal 6 karakter.' });
  });

  it('should display the server error message when login fails', async () => {
    forumApi.login.mockRejectedValue(new Error('email or password is wrong'));
    renderLogin();

    await userEvent.type(screen.getByPlaceholderText('nama@email.com'), 'dicoding@mail.com');
    await userEvent.type(screen.getByPlaceholderText('Minimal 6 karakter'), 'salah123');
    await userEvent.click(screen.getByRole('button', { name: /masuk sekarang/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('email or password is wrong');
  });
});
