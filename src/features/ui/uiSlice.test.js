/**
 * Skenario pengujian uiReducer
 *
 * - uiReducer function
 *   - harus mengubah kategori aktif ketika menerima action setCategory
 *   - harus mengubah kata kunci pencarian ketika menerima action setSearch
 *   - harus mengubah urutan ketika menerima action setSort
 *   - harus menampilkan lalu menghapus toast ketika menerima showToast dan dismissToast
 */
import { describe, expect, it } from 'vitest';
import reducer, {
  dismissToast, setCategory, setSearch, setSort, showToast,
} from './uiSlice';

const initialState = { category: 'Semua', search: '', sort: 'recent', toast: null };

describe('uiReducer function', () => {
  it('should change the active category when given setCategory action', () => {
    expect(reducer(initialState, setCategory('redux')).category).toBe('redux');
  });

  it('should change the search keyword when given setSearch action', () => {
    expect(reducer(initialState, setSearch('hooks')).search).toBe('hooks');
  });

  it('should change the sort order when given setSort action', () => {
    expect(reducer(initialState, setSort('popular')).sort).toBe('popular');
  });

  it('should show then clear the toast when given showToast and dismissToast actions', () => {
    const toast = { type: 'success', message: 'Berhasil' };
    const shown = reducer(initialState, showToast(toast));
    expect(shown.toast).toEqual(toast);
    expect(reducer(shown, dismissToast()).toast).toBeNull();
  });
});
