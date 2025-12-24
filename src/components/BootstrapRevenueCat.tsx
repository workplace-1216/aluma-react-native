// src/bootstrap/BootstrapRevenueCat.tsx
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { useAppSelector, useAppDispatch } from '../redux/store';
import {
  initRevenueCat,
  identifyRevenueCat,
  getCustomerInfoSafe,
  isPremium,
} from '../service/billing/revenuecat';
// Removed react-native-iap dependency - using RevenueCat only
import { setFromRC } from '../redux/slice/subscriptionSlice';
import { RC_ENABLED } from '../utils/env';
import { ENTITLEMENT_ID } from '../constants/billing';

const BootstrapRevenueCat: React.FC = () => {
  const userId = useAppSelector(s => s.user?._id);

  console.log('[BootstrapRC] userId:', userId);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Skip RevenueCat initialization if disabled to prevent crashes
    if (!RC_ENABLED) {
      console.log('[BootstrapRC] RevenueCat disabled, skipping initialization');
      return;
    }

    // Wrap everything in try-catch to prevent any crashes
    let timer: NodeJS.Timeout | null = null;

    try {
      // Delay initialization to ensure app is fully loaded and native modules are ready
      timer = setTimeout(() => {
        (async () => {
          try {
            // Initialize IAP connection early (especially important for iOS)
            if (Platform.OS === 'ios') {
              try {
                console.log(
                  '[BootstrapRC] ========================================',
                );
                // Removed react-native-iap initialization - using RevenueCat only
              } catch (error) {
                console.warn(
                  '[BootstrapRC] ========================================',
                );
                console.warn(
                  '[BootstrapRC] ⚠️ IAP initialization failed (non-fatal)',
                );
                console.warn(
                  '[BootstrapRC] Error:',
                  error instanceof Error ? error.message : String(error),
                );
                console.warn(
                  '[BootstrapRC] ========================================',
                );
              }
            }

            // Initialize RevenueCat with error handling
            try {
              // Only initialize if not already configured (prevents duplicate initialization)
              console.log(
                '[BootstrapRC] Calling initRevenueCat with userId:',
                userId || 'anonymous',
              );
              await initRevenueCat(userId);
              console.log(
                '[BootstrapRC] initRevenueCat completed successfully',
              );

              // Add a small delay after configure to ensure native module is stable
              await new Promise(resolve => setTimeout(resolve, 500));
              console.log(
                '[BootstrapRC] Waiting period complete, continuing...',
              );

              // Wrap identifyRevenueCat in separate try-catch to isolate crashes
              // Only call if we have a userId (skip for anonymous users)
              if (userId) {
                try {
                  console.log('[BootstrapRC] Attempting identifyRevenueCat...');
                  await identifyRevenueCat(userId);
                  console.log('[BootstrapRC] ✅ identifyRevenueCat completed');
                } catch (identifyError) {
                  console.error(
                    '[BootstrapRC] ❌ identifyRevenueCat failed (non-fatal):',
                    identifyError,
                  );
                  console.error(
                    '[BootstrapRC] Error details:',
                    identifyError instanceof Error
                      ? identifyError.stack
                      : String(identifyError),
                  );
                  // Continue even if identify fails - app can still work
                }
              } else {
                console.log('[BootstrapRC] Skipping identifyRevenueCat - no userId');
              }

              console.log(
                '[BootstrapRC] ✅ RevenueCat initialization complete',
              );
            } catch (error) {
              console.error(
                '[BootstrapRC] ❌ RevenueCat initialization failed:',
                error,
              );
              console.error(
                '[BootstrapRC] Error details:',
                error instanceof Error ? error.stack : String(error),
              );
              // Don't crash the app - continue without RevenueCat
              return;
            }

            // Removed react-native-iap - using RevenueCat only

            if (!RC_ENABLED) {
              return;
            }

            // Check customer info with proper error handling
            try {
              console.log('[BootstrapRC] Fetching customer info...');
              const info = await getCustomerInfoSafe();
              console.log(
                '[BootstrapRC] Customer info fetched, checking premium status...',
              );
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
                  if (
                    productId.includes('yearly') ||
                    productId.includes('annual')
                  ) {
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
                }),
              );

              console.log('[BootstrapRC] Subscription status checked:', {
                isPremium: premium,
                plan,
                expiry,
                hasUser: !!userId,
              });
            } catch (error) {
              console.warn(
                '[BootstrapRC] ⚠️ Failed to check subscription status (non-fatal):',
                error,
              );
            }
          } catch (error) {
            // Catch any unexpected errors to prevent app crash
            console.error(
              '[BootstrapRC] ❌ Unexpected error in bootstrap:',
              error,
            );
            console.error(
              '[BootstrapRC] Error details:',
              error instanceof Error ? error.stack : String(error),
            );
          }
        })().catch(error => {
          // Catch any unhandled promise rejections
          console.error(
            '[BootstrapRC] ❌ Unhandled error in async function:',
            error,
          );
        });
      }, 3000); // Increased delay to ensure native modules are fully loaded and stable

      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    } catch (error) {
      // Catch any synchronous errors
      console.error('[BootstrapRC] ❌ Error setting up initialization:', error);
    }
  }, [userId, dispatch]);

  return null;
};

export default BootstrapRevenueCat;
