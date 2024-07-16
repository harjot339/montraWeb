import { createSlice } from '@reduxjs/toolkit';
import { TransactionType } from '../../Defs/transaction';

const initialState: {
  // transactions: { [key: string]: transactionType },
  filters: {
    filter: 'income' | 'expense' | 'transfer' | 'none';
    sort: 'highest' | 'lowest' | 'newest' | 'oldest' | 'none';
    cat: string[];
  };
  transactions: TransactionType[];
} = {
  // transactions: {},
  filters: { filter: 'none', sort: 'none', cat: [] },
  transactions: [],
};
const TransactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setFilters(state, action) {
      if (action.payload === 0) {
        return { ...state, filters: { ...state.filters, filter: 'income' } };
      }
      if (action.payload === 1) {
        return { ...state, filters: { ...state.filters, filter: 'expense' } };
      }
      if (action.payload === 2) {
        return { ...state, filters: { ...state.filters, filter: 'transfer' } };
      }
      return { ...state, filters: { ...state.filters, filter: 'none' } };
    },
    setSortFilter(state, action) {
      if (action.payload === 0) {
        return { ...state, filters: { ...state.filters, sort: 'highest' } };
      }
      if (action.payload === 1) {
        return { ...state, filters: { ...state.filters, sort: 'lowest' } };
      }
      if (action.payload === 2) {
        return { ...state, filters: { ...state.filters, sort: 'newest' } };
      }
      if (action.payload === 3) {
        return { ...state, filters: { ...state.filters, sort: 'oldest' } };
      }
      return { ...state, filters: { ...state.filters, sort: 'none' } };
    },
    setCatFilter(state, action) {
      return { ...state, filters: { ...state.filters, cat: action.payload } };
    },
    clearCatFilter(state) {
      return { ...state, filters: { ...state.filters, cat: [] } };
    },
    setTransactions(state, action) {
      return { ...state, transactions: action.payload };
    },
  },
});
export const {
  setFilters,
  setSortFilter,
  setCatFilter,
  clearCatFilter,
  setTransactions,
} = TransactionSlice.actions;
export default TransactionSlice.reducer;
