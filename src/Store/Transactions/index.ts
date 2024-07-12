import { createSlice } from '@reduxjs/toolkit';
import { TransactionType } from '../../Defs/transaction';

const initialState: {
  // transactions: { [key: string]: transactionType },
  isFilterOpen: boolean;
  isCatOpen: boolean;
  filters: {
    filter: 'income' | 'expense' | 'transfer' | 'none';
    sort: 'highest' | 'lowest' | 'newest' | 'oldest' | 'none';
    cat: string[];
  };
  transactions: TransactionType[];
  isLogoutOpen: boolean;
  isTabButtonOpen: boolean;
} = {
  // transactions: {},
  isFilterOpen: false,
  isCatOpen: false,
  filters: { filter: 'none', sort: 'none', cat: [] },
  isLogoutOpen: false,
  isTabButtonOpen: false,
  transactions: [],
};
const TransactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    // openFilterSheet(state, action) {
    //   state.isFilterOpen = action.payload;
    // },
    // openCatSheet(state, action) {
    //   state.isCatOpen = action.payload;
    // },
    // openLogoutSheet(state, action) {
    //   state.isLogoutOpen = action.payload;
    // },
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
    // setTabButton(state, action) {
    //   state.isTabButtonOpen = action.payload;
    // },
    setTransactions(state, action) {
      return { ...state, transactions: action.payload };
    },
  },
});
export const {
  //   openFilterSheet,
  setFilters,
  //   openCatSheet,
  setSortFilter,
  setCatFilter,
  clearCatFilter,
  //   openLogoutSheet,
  //   setTabButton,
  setTransactions,
} = TransactionSlice.actions;
export default TransactionSlice.reducer;
