import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { category: 'Semua', search: '', sort: 'recent', toast: null },
  reducers: {
    setCategory(state, action) { state.category = action.payload; },
    setSearch(state, action) { state.search = action.payload; },
    setSort(state, action) { state.sort = action.payload; },
    showToast(state, action) { state.toast = action.payload; },
    dismissToast(state) { state.toast = null; },
  },
});

export const { setCategory, setSearch, setSort, showToast, dismissToast } = uiSlice.actions;
export default uiSlice.reducer;
