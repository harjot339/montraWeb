import { createSlice } from '@reduxjs/toolkit';

const loader = createSlice({
  name: 'loader',
  initialState: { isLoading: false, sidebar: false },
  reducers: {
    setLoading: (state, action) => ({
      ...state,
      isLoading: action.payload,
    }),
    setSidebar: (state, action) => ({
      ...state,
      sidebar: action.payload,
    }),
  },
});

export const { setLoading, setSidebar } = loader.actions;

export default loader.reducer;
