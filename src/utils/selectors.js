import { createSelector } from '@reduxjs/toolkit';

const selectItems = (state) => state.threads.items;
const selectCategory = (state) => state.ui.category;
const selectSearch = (state) => state.ui.search;
const selectSort = (state) => state.ui.sort;

/** Memoized: React-Redux receives a stable reference until source data actually changes. */
export const selectFilteredThreads = createSelector(
  [selectItems, selectCategory, selectSearch, selectSort],
  (items, category, search, sort) => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = items.filter((thread) => {
      const matchesCategory = category === 'Semua' || thread.category === category;
      const matchesSearch = !normalizedSearch || `${thread.title} ${thread.body} ${thread.category}`
        .toLowerCase().includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
    return filtered.sort((a, b) => {
      if (sort === 'popular') return ((b.upVotesBy?.length || 0) - (b.downVotesBy?.length || 0))
        - ((a.upVotesBy?.length || 0) - (a.downVotesBy?.length || 0));
      if (sort === 'discussed') return (b.totalComments || 0) - (a.totalComments || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },
);

export const selectCategories = createSelector([selectItems], (items) =>
  [...new Set(items.map((thread) => thread.category).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b)));
