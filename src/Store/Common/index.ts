import { createSlice } from '@reduxjs/toolkit';
import { UserType } from '../../Defs/user';

const initialState: { user: UserType | undefined } = { user: undefined };
const common = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setUser(state, action) {
      return { ...state, user: action.payload };
    },
  },
});

export const { setUser } = common.actions;

export default common.reducer;
