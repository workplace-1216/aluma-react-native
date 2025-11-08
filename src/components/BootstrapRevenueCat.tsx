// src/bootstrap/BootstrapRevenueCat.tsx
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { useAppSelector, useAppDispatch } from '../redux/store';
import {
  initRevenueCat,
  identifyRevenueCat,
  getCustomerInfoSafe,
  isPremium,
  getProductsFromAppStore,
} from '../service/billing/revenuecat';
import { ensureIapConnection } from '../service/billing/iap';
import { setFromRC } from '../redux/slice/subscriptionSlice';
import { RC_ENABLED } from '../utils/env';

const BootstrapRevenueCat: React.FC = () => {
  const userId = useAppSelector(s => s.user?._id);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      // Initialize IAP connection early (especially important for iOS)
      if (Platform.OS === 'ios') {
        try {
          console.log('[BootstrapRC] ========================================');
          console.log('[BootstrapRC] 🍎 INITIALIZING IAP for Direct App Store Access');
          console.log('[BootstrapRC] ========================================');
          await ensureIapConnection();
          console.log('[BootstrapRC] ✅ IAP initialization complete');
        } catch (error) {
          console.warn('[BootstrapRC] ========================================');
          console.warn('[BootstrapRC] ⚠️ IAP initialization failed (non-fatal)');
          console.warn('[BootstrapRC] Error:', error instanceof Error ? error.message : String(error));
          console.warn('[BootstrapRC] ========================================');
        }
      }

      await initRevenueCat(userId);
      await identifyRevenueCat(userId);

      // Try to fetch products directly from App Store Connect using react-native-iap
      if (RC_ENABLED) {
        console.log('[BootstrapRC] ========================================');
        console.log('[BootstrapRC] 🔍 FETCHING PRODUCTS FROM APP STORE');
        console.log('[BootstrapRC] Method: react-native-iap (direct)');
        console.log('[BootstrapRC] ========================================');
        await getProductsFromAppStore();
        console.log('[BootstrapRC] ✅ Product fetch complete');
      }

      if (!RC_ENABLED) {return;}
      const info = await getCustomerInfoSafe();
      dispatch(
        setFromRC({
          isPremium: isPremium(info),
          plan: undefined,
          expiry: undefined,
        })
      );
    })();
  }, [userId, dispatch]);

  return null;
};

export default BootstrapRevenueCat;
