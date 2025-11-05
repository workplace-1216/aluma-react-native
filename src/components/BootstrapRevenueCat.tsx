// src/bootstrap/BootstrapRevenueCat.tsx
import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/store';
import {
  initRevenueCat,
  identifyRevenueCat,
  getCustomerInfoSafe,
  isPremium,
  smokeTestStoreKit,
} from '../service/billing/revenuecat';
import { setFromRC } from '../redux/slice/subscriptionSlice';
import { RC_ENABLED } from '../utils/env';

const BootstrapRevenueCat: React.FC = () => {
  const userId = useAppSelector(s => s.user?._id);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      await initRevenueCat(userId);
      await identifyRevenueCat(userId);

      // Run smoke test once in dev to ensure StoreKit/Billing is visible
      await smokeTestStoreKit();

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
