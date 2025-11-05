// src/redux/slice/subscriptionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SubscriptionState = {
  isPremium: boolean;
  plan?: 'monthly' | 'yearly';
  expiry?: string;
  loading: boolean;
  error?: string | null;
};

const initialState: SubscriptionState = {
  isPremium: false,
  loading: false,
};

export const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setLoading: (s, a: PayloadAction<boolean>) => {
      s.loading = a.payload;
    },
    setError: (s, a: PayloadAction<string | null>) => {
      s.error = a.payload ?? null;
    },
    setFromRC: (
      s,
      a: PayloadAction<{ isPremium: boolean; plan?: 'monthly' | 'yearly'; expiry?: string }>
    ) => {
      s.isPremium = a.payload.isPremium;
      s.plan = a.payload.plan;
      s.expiry = a.payload.expiry;
    },
    resetSubscription: () => initialState,
  },
});

export const { setLoading, setError, setFromRC, resetSubscription } =
  subscriptionSlice.actions;
export default subscriptionSlice.reducer;
