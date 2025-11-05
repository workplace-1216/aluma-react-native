import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface AuthState {
  token: {token: string} | null;
  refreshToken: string;
}
const initialState: AuthState = {
  token: null,
  refreshToken: '',
};
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },
      resetToken: (state) => {
      state.token = null;
      state.refreshToken = '';
    },

  },
});

export const {setToken, setRefreshToken, resetToken} = authSlice.actions;
export default authSlice.reducer;
