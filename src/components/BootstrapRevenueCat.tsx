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
import { ENTITLEMENT_ID } from '../constants/billing';

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
      const premium = isPremium(info);
      
      // Extract plan and expiry from RevenueCat for anonymous users
      let plan: 'monthly' | 'yearly' | undefined;
      let expiry: string | undefined;
      
      if (premium && info) {
        const entitlement = info.entitlements.active[ENTITLEMENT_ID];
        if (entitlement) {
          expiry = entitlement.expirationDate ?? undefined;
          // Determine plan from product identifier
          const productId = entitlement.productIdentifier || '';
          if (productId.includes('yearly') || productId.includes('annual')) {
            plan = 'yearly';
          } else if (productId.includes('monthly')) {
            plan = 'monthly';
          }
        }
      }
      
      dispatch(
        setFromRC({
          isPremium: premium,
          plan,
          expiry,
        })
      );
      
      console.log('[BootstrapRC] Subscription status checked:', {
        isPremium: premium,
        plan,
        expiry,
        hasUser: !!userId,
      });
    })();
  }, [userId, dispatch]);

  return null;
};

export default BootstrapRevenueCat;
