import { Platform } from 'react-native';
import {
  getSubscriptions,
  initConnection,
  Subscription,
  flushFailedPurchasesCachedAsPendingAndroid,
  endConnection,
} from 'react-native-iap';

let iapInitialized = false;
let initializingPromise: Promise<boolean> | null = null;

/**
 * Initialize IAP connection. Should be called early in app lifecycle.
 * Safe to call multiple times - will only initialize once.
 */
export async function ensureIapConnection(): Promise<boolean> {
  if (iapInitialized) {
    console.log('[IAP][INIT] ✅ Already initialized, skipping');
    return true;
  }

  if (initializingPromise) {
    console.log('[IAP][INIT] ⏳ Initialization already in progress, waiting...');
    return initializingPromise;
  }

  const startTime = Date.now();
  initializingPromise = (async () => {
    try {
      console.log('[IAP][INIT] ========================================');
      console.log('[IAP][INIT] 🔌 STARTING IAP Connection Initialization');
      console.log('[IAP][INIT] Platform:', Platform.OS);
      console.log('[IAP][INIT] ========================================');
      
      const connected = await initConnection();

      if (Platform.OS === 'android') {
        try {
          await flushFailedPurchasesCachedAsPendingAndroid();
          console.log('[IAP][INIT] ✅ Flushed failed purchases cache (Android)');
        } catch (_e) {
          console.warn('[IAP][INIT] ⚠️ Failed to flush purchases cache (non-fatal)');
        }
      }

      iapInitialized = connected;
      const duration = Date.now() - startTime;
      console.log('[IAP][INIT] ========================================');
      console.log('[IAP][INIT] ✅ IAP CONNECTION INITIALIZED SUCCESSFULLY');
      console.log('[IAP][INIT] Connected:', connected);
      console.log('[IAP][INIT] Duration:', `${duration}ms`);
      console.log('[IAP][INIT] ========================================');
      return connected;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('[IAP][INIT] ========================================');
      console.error('[IAP][INIT] ❌ IAP CONNECTION INITIALIZATION FAILED');
      console.error('[IAP][INIT] Error:', error instanceof Error ? error.message : String(error));
      console.error('[IAP][INIT] Duration:', `${duration}ms`);
      console.error('[IAP][INIT] ========================================');
      iapInitialized = false;
      throw error;
    } finally {
      initializingPromise = null;
    }
  })();

  return initializingPromise;
}

/**
 * End IAP connection (useful for cleanup, testing, etc.)
 */
export async function disconnectIap(): Promise<void> {
  try {
    if (iapInitialized) {
      await endConnection();
      iapInitialized = false;
      console.log('[IAP] 🔌 IAP connection ended');
    }
  } catch (error) {
    console.error('[IAP] ❌ Error ending IAP connection', error);
  }
}

export type NormalizedSubscription = {
  identifier: string;
  title: string;
  priceString: string | null;
  description: string | null;
  subscriptionPeriod?: string | null;
  raw: Subscription;
};

function normalizeSubscription(subscription: Subscription): NormalizedSubscription {
  // Type-safe access to subscription properties (iOS vs Android have different properties)
  const sub = subscription as any;
  return {
    identifier: subscription.productId,
    title: subscription.title ?? subscription.productId,
    priceString: sub.localizedPrice ?? sub.price ?? null,
    description: subscription.description ?? null,
    subscriptionPeriod:
      sub.subscriptionPeriodNumber && sub.subscriptionPeriodUnit
        ? `${sub.subscriptionPeriodNumber}${sub.subscriptionPeriodUnit}`
        : null,
    raw: subscription,
  };
}

/**
 * Fetch subscriptions directly from App Store Connect / Play Store.
 * This bypasses RevenueCat and queries the stores directly.
 */
export async function fetchSubscriptions(productIds: string[]): Promise<NormalizedSubscription[]> {
  const startTime = Date.now();
  
  if (!productIds || productIds.length === 0) {
    console.warn('[IAP][FETCH] ⚠️ No product IDs provided to fetchSubscriptions');
    return [];
  }

  try {
    console.log('[IAP][FETCH] ========================================');
    console.log('[IAP][FETCH] 🔍 STARTING Subscription Fetch');
    console.log('[IAP][FETCH] Platform:', Platform.OS);
    console.log('[IAP][FETCH] Requested Product IDs:', productIds);
    console.log('[IAP][FETCH] Count:', productIds.length);
    console.log('[IAP][FETCH] ========================================');

    await ensureIapConnection();

    console.log('[IAP][FETCH] 📡 Calling getSubscriptions() with:', { skus: productIds });
    
    let subscriptions: Subscription[] = [];
    try {
      subscriptions = await getSubscriptions({ skus: productIds });
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorCode = (error as any)?.code || (error as any)?.errorCode;
      
      console.error('[IAP][FETCH] ========================================');
      console.error('[IAP][FETCH] ❌ getSubscriptions() THREW AN ERROR');
      console.error('[IAP][FETCH] Error Code:', errorCode || 'N/A');
      console.error('[IAP][FETCH] Error Message:', errorMessage);
      console.error('[IAP][FETCH] Duration:', `${duration}ms`);
      console.error('[IAP][FETCH] ========================================');
      
      // Provide specific guidance based on error
      if (errorMessage.includes('No products found') || errorMessage.includes('invalid product')) {
        console.error('[IAP][FETCH] 🔍 DIAGNOSIS: Products not found in App Store');
        console.error('[IAP][FETCH] 📋 CHECKLIST:');
        console.error('[IAP][FETCH]   1. ✅ Product IDs match exactly (case-sensitive):', productIds);
        console.error('[IAP][FETCH]   2. ⚠️ Products must be SUBMITTED (not just "Waiting for Review")');
        console.error('[IAP][FETCH]   3. ⚠️ Products must be linked to your app version in App Store Connect');
        console.error('[IAP][FETCH]   4. ⚠️ App version must be SUBMITTED (not just saved)');
        console.error('[IAP][FETCH]   5. ⏳ Wait 15-30 minutes after submission for propagation');
        console.error('[IAP][FETCH]   6. 🔐 Ensure you are signed in with a sandbox test account');
        console.error('[IAP][FETCH] ========================================');
      }
      
      // Re-throw to be caught by outer catch
      throw error;
    }
    
    const duration = Date.now() - startTime;
    
    console.log('[IAP][FETCH] ========================================');
    console.log('[IAP][FETCH] 📊 FETCH RESULTS SUMMARY');
    console.log('[IAP][FETCH] Requested:', productIds.length, 'products');
    console.log('[IAP][FETCH] Received:', subscriptions.length, 'products');
    console.log('[IAP][FETCH] Duration:', `${duration}ms`);
    if (subscriptions.length === 0 && duration < 100) {
      console.warn('[IAP][FETCH] ⚠️ Very fast response (<100ms) with 0 products suggests products are not available in store');
      console.warn('[IAP][FETCH]    This typically means products need to be submitted with an app version');
    }
    console.log('[IAP][FETCH] ========================================');

    if (subscriptions.length > 0) {
      console.log('[IAP][FETCH] ✅ SUCCESS - Products Found:');
      subscriptions.forEach((sub: Subscription, index: number) => {
        const subAny = sub as any;
        console.log(`[IAP][FETCH]   [${index + 1}/${subscriptions.length}] Product Details:`);
        console.log(`[IAP][FETCH]      ID: ${sub.productId}`);
        console.log(`[IAP][FETCH]      Title: ${sub.title || 'N/A'}`);
        console.log(`[IAP][FETCH]      Price: ${subAny.localizedPrice || subAny.price || 'N/A'}`);
        console.log(`[IAP][FETCH]      Description: ${sub.description ? sub.description.substring(0, 50) + '...' : 'N/A'}`);
        console.log(`[IAP][FETCH]      Period: ${subAny.subscriptionPeriodNumber || ''}${subAny.subscriptionPeriodUnit || ''}`);
        console.log(`[IAP][FETCH]      Currency: ${subAny.currency || 'N/A'}`);
      });
    } else {
      console.warn('[IAP][FETCH] ========================================');
      console.warn('[IAP][FETCH] ⚠️ WARNING - NO PRODUCTS RETURNED (but no error thrown)');
      console.warn('[IAP][FETCH] Requested Product IDs:', productIds);
      console.warn('[IAP][FETCH] ========================================');
      console.warn('[IAP][FETCH] 🔍 TROUBLESHOOTING STEPS:');
      console.warn('[IAP][FETCH]   1. Verify Product IDs in App Store Connect match exactly:');
      productIds.forEach(id => {
        console.warn(`[IAP][FETCH]      - "${id}" (check case, spaces, underscores)`);
      });
      console.warn('[IAP][FETCH]   2. Check Product Status in App Store Connect:');
      console.warn('[IAP][FETCH]      - Status should be "Waiting for Review" or "Ready for Sale"');
      console.warn('[IAP][FETCH]      - Products MUST be SUBMITTED with an app version');
      console.warn('[IAP][FETCH]      - "Ready to Submit" status is NOT sufficient for sandbox');
      console.warn('[IAP][FETCH]   3. Verify App Version Linkage:');
      console.warn('[IAP][FETCH]      - Products must be included in a submitted app version');
      console.warn('[IAP][FETCH]      - Go to: App Store Connect > Your App > In-App Purchases');
      console.warn('[IAP][FETCH]      - Ensure products are linked to your current app version');
      console.warn('[IAP][FETCH]   4. Check Sandbox Environment:');
      console.warn('[IAP][FETCH]      - Sign out of App Store in Settings > App Store');
      console.warn('[IAP][FETCH]      - Use a sandbox test account when prompted');
      console.warn('[IAP][FETCH]      - Wait 15-30 minutes after submission for propagation');
      console.warn('[IAP][FETCH]   5. Verify Bundle ID matches:');
      console.warn('[IAP][FETCH]      - Product must be associated with correct Bundle ID');
      console.warn('[IAP][FETCH] ========================================');
      console.warn('[IAP][FETCH] 💡 IMPORTANT: Even if products show "Waiting for Review",');
      console.warn('[IAP][FETCH]      they must be SUBMITTED with an app version to be');
      console.warn('[IAP][FETCH]      available in sandbox. "Waiting for Review" alone is');
      console.warn('[IAP][FETCH]      not enough - they need to be part of a submitted app.');
      console.warn('[IAP][FETCH] ========================================');
    }

    const normalized = subscriptions.map(normalizeSubscription);
    
    console.log('[IAP][FETCH] ========================================');
    console.log('[IAP][FETCH] ✅ FETCH COMPLETE');
    console.log('[IAP][FETCH] Returning', normalized.length, 'normalized subscriptions');
    console.log('[IAP][FETCH] ========================================');
    
    return normalized;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[IAP][FETCH] ========================================');
    console.error('[IAP][FETCH] ❌ FETCH FAILED');
    console.error('[IAP][FETCH] Product IDs:', productIds);
    console.error('[IAP][FETCH] Platform:', Platform.OS);
    console.error('[IAP][FETCH] Duration:', `${duration}ms`);
    console.error('[IAP][FETCH] Error Type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('[IAP][FETCH] Error Message:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error('[IAP][FETCH] Stack:', error.stack);
    }
    console.error('[IAP][FETCH] ========================================');
    throw error;
  }
}

export function supportsStoreKitInAppPurchases() {
  return Platform.OS === 'ios';
}

