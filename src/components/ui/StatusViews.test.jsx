/**
 * Skenario pengujian komponen StatusViews
 *
 * - ErrorState component
 *   - harus menampilkan pesan error yang diberikan
 *   - harus memanggil onRetry ketika tombol "Coba lagi" ditekan
 *   - tidak boleh menampilkan tombol "Coba lagi" ketika onRetry tidak diberikan
 *
 * - EmptyState component
 *   - harus menampilkan judul, deskripsi, dan elemen action
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EmptyState, ErrorState } from './StatusViews';

describe('ErrorState component', () => {
  it('should display the given error message', () => {
    render(<ErrorState message="Diskusi tidak ditemukan." />);

    expect(screen.getByText('Diskusi tidak ditemukan.')).toBeInTheDocument();
  });

  it('should call onRetry when the retry button is clicked', async () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Gagal memuat" onRetry={onRetry} />);

    await userEvent.click(screen.getByRole('button', { name: /coba lagi/i }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should not render the retry button when onRetry is not provided', () => {
    render(<ErrorState message="Gagal memuat" />);

    expect(screen.queryByRole('button', { name: /coba lagi/i })).not.toBeInTheDocument();
  });
});

describe('EmptyState component', () => {
  it('should display the title, description, and action element', () => {
    render(<EmptyState title="Kosong" description="Belum ada data" action={<button type="button">Buat</button>} />);

    expect(screen.getByRole('heading', { name: 'Kosong' })).toBeInTheDocument();
    expect(screen.getByText('Belum ada data')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Buat' })).toBeInTheDocument();
  });
});
