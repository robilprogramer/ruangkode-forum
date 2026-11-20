/**
 * Skenario pengujian selector thread
 *
 * - selectFilteredThreads
 *   - harus memfilter thread berdasarkan kategori dari state
 *   - harus mencari thread tanpa membedakan huruf besar dan kecil
 *   - harus mengurutkan thread berdasarkan jumlah komentar terbanyak
 *
 * - selectCategories
 *   - harus mengembalikan kategori unik yang terurut alfabetis
 */
import { describe, expect, it } from 'vitest';
import { selectCategories, selectFilteredThreads } from './selectors';

const makeState = (category = 'Semua', search = '', sort = 'recent') => ({
  ui: { category, search, sort },
  threads: { items: [
    { id: '1', category: 'React', title: 'Redux', body: 'Store', createdAt: '2026-01-02', totalComments: 7, upVotesBy: ['a', 'b'], downVotesBy: [] },
    { id: '2', category: 'JavaScript', title: 'Promises', body: 'async await', createdAt: '2026-01-03', totalComments: 1, upVotesBy: ['a'], downVotesBy: [] },
  ] },
});

describe('thread selectors', () => {
  it('filter kategori murni menggunakan state (bukan API)', () => {
    expect(selectFilteredThreads(makeState('React')).map(({ id }) => id)).toEqual(['1']);
  });
  it('pencarian tidak membedakan huruf besar dan kecil', () => {
    expect(selectFilteredThreads(makeState('Semua', 'ASYNC')).map(({ id }) => id)).toEqual(['2']);
  });
  it('sort komentar terbanyak', () => {
    expect(selectFilteredThreads(makeState('Semua', '', 'discussed')).map(({ id }) => id)).toEqual(['1', '2']);
  });
  it('kategori unik, urut alfabetis', () => {
    expect(selectCategories(makeState())).toEqual(['JavaScript', 'React']);
  });
});
