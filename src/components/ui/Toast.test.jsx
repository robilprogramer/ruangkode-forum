/**
 * Skenario pengujian komponen Toast
 *
 * - Toast component
 *   - tidak boleh merender apa pun ketika tidak ada toast di store
 *   - harus menampilkan pesan toast dari store
 *   - harus menghapus toast ketika tombol tutup ditekan
 */
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/renderWithProviders';
import Toast from './Toast';

const uiState = (toast) => ({ ui: { category: 'Semua', search: '', sort: 'recent', toast } });

describe('Toast component', () => {
  it('should render nothing when there is no toast in the store', () => {
    renderWithProviders(<Toast />, { preloadedState: uiState(null) });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should display the toast message from the store', () => {
    renderWithProviders(<Toast />, { preloadedState: uiState({ type: 'success', message: 'Berhasil masuk' }) });

    expect(screen.getByRole('alert')).toHaveTextContent('Berhasil masuk');
  });

  it('should clear the toast when the close button is clicked', async () => {
    const { store } = renderWithProviders(<Toast />, {
      preloadedState: uiState({ type: 'error', message: 'Gagal' }),
    });

    await userEvent.click(screen.getByRole('button', { name: 'Tutup notifikasi' }));

    expect(store.getState().ui.toast).toBeNull();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
