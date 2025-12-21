import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface Subscription {
  plan: 'free' | 'monthly' | 'annual';
  expiry: string;
}

export interface Sessions {
  count: number;
  lastSessionDate?: string;
}

export interface UserState {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  purpose: string;
  provider?: string;
  isAnonymous?: boolean;
  guestDeviceId?: string;
  googleAccount?: boolean;
  allowNotifications?: boolean;
  dailyQouteNotification?: boolean;
  subscription?: Subscription;
  sessions?: Sessions;
  playingTime?: {
    count: number;
    lastPlayingTimeDate?: string;
  };
}

const initialState: UserState = {
  _id: '',
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  purpose: '',
  provider: '',
  isAnonymous: false,
  guestDeviceId: undefined,
  googleAccount: false,
  allowNotifications: false,
  dailyQouteNotification: false,
  subscription: {
    plan: 'free',
    expiry: '',
  },
  sessions: {
    count: 0,
    lastSessionDate: undefined,
  },
  playingTime: {
    count: 0,
    lastPlayingTimeDate: undefined,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return {...state, ...action.payload};
    },
    resetUser: () => initialState,
    updateSessions: (state, action: PayloadAction<Sessions>) => {
      state.sessions = action.payload;
    },
    updatePlayingTime: (
      state,
      action: PayloadAction<{count: number; lastPlayingTimeDate?: string}>,
    ) => {
      state.playingTime = action.payload;
    },
  },
});

export const {setUser, resetUser, updateSessions, updatePlayingTime} =
  userSlice.actions;
export default userSlice.reducer;
