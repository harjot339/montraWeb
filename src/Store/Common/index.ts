import { createSlice } from '@reduxjs/toolkit';
import { UserType } from '../../Defs/user';

const initialState: {
  user: UserType | undefined;
  conversion: { [key: string]: { [key: string]: number } };
} = { user: undefined, conversion: {} };
const common = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setUser(state, action) {
      return { ...state, user: action.payload };
    },
    setConversionData(state, action) {
      return { ...state, conversion: action.payload };
    },
    addExpenseCategory(state, action) {
      return {
        ...state,
        user: {
          ...state.user!,
          expenseCategory: [...state.user!.expenseCategory, action.payload],
        },
      };
    },
    addIncomeCategory(state, action) {
      return {
        ...state,
        user: {
          ...state.user!,
          incomeCategory: [...state.user!.incomeCategory, action.payload],
        },
      };
    },
  },
});

export const {
  setUser,
  setConversionData,
  addExpenseCategory,
  addIncomeCategory,
} = common.actions;

export default common.reducer;
