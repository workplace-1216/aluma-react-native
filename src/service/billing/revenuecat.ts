// src/service/billing/revenuecat.ts
import Purchases, {
  LOG_LEVEL,
  PurchasesPackage,
  PurchasesOffering,
  CustomerInfo,
} from 'react-native-purchases';
import { Platform } from 'react-native';

import { ENTITLEMENT_ID, PACKAGE_ID_BY_PLAN, PRODUCT_ID_BY_PLAN, PurchasePlan } from '../../constants/billing';

import { RC_API_KEY_IOS, RC_API_KEY_ANDROID, RC_ENABLED } from '../../utils/env';
import { fetchSubscriptions, supportsStoreKitInAppPurchases } from './iap';

let configured = false;

/** Initialize RevenueCat as early as possible (App bootstrap). */
export async function initRevenueCat(appUserId?: string) {
  try {
    if (!RC_ENABLED || configured) {
      console.log('[RC] RevenueCat disabled or already configured. RC_ENABLED:', RC_ENABLED, 'configured:', configured);
      return;
    }

    const apiKey = Platform.OS === 'ios' ? RC_API_KEY_IOS : RC_API_KEY_ANDROID;
    if (!apiKey) {
      console.warn('[RC] Missing API key for current platform; skipping configure. Platform:', Platform.OS);
      return;
    }

    console.log('[RC] Initializing RevenueCat...', {
      platform: Platform.OS,
      apiKeyPrefix: apiKey.substring(0, 10) + '...',
      apiKeyLength: apiKey.length,
      appUserId: appUserId || 'anonymous',
      expectedProducts: Object.values(PRODUCT_ID_BY_PLAN),
      expectedPackages: Object.values(PACKAGE_ID_BY_PLAN),
      entitlementId: ENTITLEMENT_ID,
    });

    // Enable detailed logs while developing
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);

    await Purchases.configure({
      apiKey,
      appUserID: appUserId || undefined,
      // observerMode: false, // default
    });

    configured = true;
    console.log('[RC] ✅ configure() done successfully. Platform:', Platform.OS);
  } catch (e) {
    console.error('[RC] ❌ initRevenueCat error:', e);
  }
}

/** Link your own user id (optional but recommended if you have login). */
export async function identifyRevenueCat(appUserId?: string) {
  if (!RC_ENABLED || !configured) {return;}
  if (!appUserId) {return;}

  try {
    const result = await Purchases.logIn(appUserId);
    if (result?.created) {
      console.log('[RC] logIn(): purchases migrated to user id:', appUserId);
    } else {
      console.log('[RC] logIn(): user already logged in:', appUserId);
    }
  } catch (e) {
    console.warn('[RC] logIn error (non-fatal):', e);
  }
}

/** Fetch products directly from App Store Connect (bypasses RevenueCat offerings). */
export async function getProductsFromAppStore() {
  if (!RC_ENABLED || !configured) {
    console.log('[RC][getProductsFromAppStore] ⚠️ Skipping - RC_ENABLED:', RC_ENABLED, 'configured:', configured);
    return [];
  }

  const productIds = Object.values(PRODUCT_ID_BY_PLAN);
  console.log('[RC][getProductsFromAppStore] 🔍 Fetching products directly from App Store Connect...', {
    productIds,
    platform: Platform.OS,
  });

  try {
    type DirectProduct = {
      identifier: string;
      title: string | null;
      priceString: string | null;
      description: string | null;
      subscriptionPeriod?: string | null;
      source: 'iap' | 'revenuecat';
      raw: unknown;
    };

    let products: DirectProduct[] = [];

    // Prioritize react-native-iap for iOS to fetch directly from App Store
    if (supportsStoreKitInAppPurchases()) {
      console.log('[RC][getProductsFromAppStore] ========================================');
      console.log('[RC][getProductsFromAppStore] 🍎 ATTEMPTING: react-native-iap (Direct App Store)');
      console.log('[RC][getProductsFromAppStore] Product IDs:', productIds);
      console.log('[RC][getProductsFromAppStore] ========================================');
      try {
        const subscriptions = await fetchSubscriptions(productIds);
        products = subscriptions.map(sub => ({
          identifier: sub.identifier,
          title: sub.title,
          priceString: sub.priceString,
          description: sub.description,
          subscriptionPeriod: sub.subscriptionPeriod ?? null,
          source: 'iap',
          raw: sub.raw,
        }));
        // If IAP returned 0 products, try RevenueCat as fallback
        if (products.length === 0) {
          console.warn('[RC][getProductsFromAppStore] ========================================');
          console.warn('[RC][getProductsFromAppStore] ⚠️ react-native-iap returned 0 products, trying RevenueCat fallback');
          console.warn('[RC][getProductsFromAppStore] ========================================');
          try {
            console.log('[RC][getProductsFromAppStore] 🔄 Attempting RevenueCat fallback...');
            const purchasesProducts = await Purchases.getProducts(productIds);
            const rcProducts = purchasesProducts.map(p => ({
              identifier: p.identifier,
              title: p.title ?? null,
              priceString: p.priceString ?? null,
              description: p.description ?? null,
              subscriptionPeriod: p.subscriptionPeriod ?? null,
              source: 'revenuecat' as const,
              raw: p,
            }));
            if (rcProducts.length > 0) {
              products = rcProducts;
              console.log('[RC][getProductsFromAppStore] ✅ RevenueCat fallback returned', products.length, 'products');
            } else {
              console.warn('[RC][getProductsFromAppStore] ⚠️ RevenueCat also returned 0 products');
            }
          } catch (rcError) {
            console.warn('[RC][getProductsFromAppStore] ⚠️ RevenueCat fallback also failed:', rcError instanceof Error ? rcError.message : String(rcError));
          }
        } else {
          console.log('[RC][getProductsFromAppStore] ========================================');
          console.log('[RC][getProductsFromAppStore] ✅ SUCCESS: react-native-iap returned', products.length, 'products');
          console.log('[RC][getProductsFromAppStore] Source: Direct App Store (react-native-iap)');
          console.log('[RC][getProductsFromAppStore] Products:', products.map(p => ({
            id: p.identifier,
            title: p.title,
            price: p.priceString,
          })));
          console.log('[RC][getProductsFromAppStore] ========================================');
        }
      } catch (iapError) {
        console.warn('[RC][getProductsFromAppStore] ========================================');
        console.warn('[RC][getProductsFromAppStore] ⚠️ react-native-iap FAILED, falling back to RevenueCat');
        console.warn('[RC][getProductsFromAppStore] Error:', iapError instanceof Error ? iapError.message : String(iapError));
        console.warn('[RC][getProductsFromAppStore] ========================================');
        // Fallback to RevenueCat if IAP fails
        console.log('[RC][getProductsFromAppStore] 🔄 Attempting RevenueCat fallback...');
        const purchasesProducts = await Purchases.getProducts(productIds);
        products = purchasesProducts.map(p => ({
          identifier: p.identifier,
          title: p.title ?? null,
          priceString: p.priceString ?? null,
          description: p.description ?? null,
          subscriptionPeriod: p.subscriptionPeriod ?? null,
          source: 'revenuecat',
          raw: p,
        }));
        console.log('[RC][getProductsFromAppStore] ✅ RevenueCat fallback returned', products.length, 'products');
      }
    } else {
      console.log('[RC][getProductsFromAppStore] Using RevenueCat Purchases.getProducts() for direct fetch...', {
        platform: Platform.OS,
      });
      const purchasesProducts = await Purchases.getProducts(productIds);
      products = purchasesProducts.map(p => ({
        identifier: p.identifier,
        title: p.title ?? null,
        priceString: p.priceString ?? null,
        description: p.description ?? null,
        subscriptionPeriod: p.subscriptionPeriod ?? null,
        source: 'revenuecat',
        raw: p,
      }));
    }

    // Final summary log
    console.log('[RC][getProductsFromAppStore] ========================================');
    console.log('[RC][getProductsFromAppStore] 📊 FINAL RESULT SUMMARY');
    console.log('[RC][getProductsFromAppStore] Requested:', productIds.length, 'product IDs');
    console.log('[RC][getProductsFromAppStore] Fetched:', products.length, 'products');
    console.log('[RC][getProductsFromAppStore] Source:', products.length > 0 ? products[0].source : 'none');
    console.log('[RC][getProductsFromAppStore] ========================================');
    if (products.length > 0) {
      products.forEach((p, index) => {
        console.log(`[RC][getProductsFromAppStore]   [${index + 1}/${products.length}] ${p.identifier}`);
        console.log(`[RC][getProductsFromAppStore]      Title: ${p.title || 'N/A'}`);
        console.log(`[RC][getProductsFromAppStore]      Price: ${p.priceString || 'N/A'}`);
        console.log(`[RC][getProductsFromAppStore]      Source: ${p.source}`);
      });
    }
    console.log('[RC][getProductsFromAppStore] ========================================');

    if (products.length === 0) {
      console.error('[RC][getProductsFromAppStore] ❌ No products fetched from App Store Connect.');
      console.error('[RC][getProductsFromAppStore]    Product IDs requested:', productIds);
      console.error('[RC][getProductsFromAppStore]    ========================================');
      console.error('[RC][getProductsFromAppStore]    🔍 ROOT CAUSE ANALYSIS:');
      console.error('[RC][getProductsFromAppStore]    Products in "Waiting for Review" status are NOT automatically');
      console.error('[RC][getProductsFromAppStore]    available for sandbox testing. They must be SUBMITTED as part');
      console.error('[RC][getProductsFromAppStore]    of an app version to become available.');
      console.error('[RC][getProductsFromAppStore]    ========================================');
      console.error('[RC][getProductsFromAppStore]    📋 STEP-BY-STEP SOLUTION:');
      console.error('[RC][getProductsFromAppStore]    1. ✅ Products created: aluma_monthly, aluma_yearly (DONE)');
      console.error('[RC][getProductsFromAppStore]    2. ⚠️ CRITICAL: Products must be included in a SUBMITTED app version');
      console.error('[RC][getProductsFromAppStore]       - Go to App Store Connect > Your App > App Store tab');
      console.error('[RC][getProductsFromAppStore]       - Create/Edit a version (e.g., 1.0.0)');
      console.error('[RC][getProductsFromAppStore]       - Scroll to "In-App Purchases" section');
      console.error('[RC][getProductsFromAppStore]       - Add your products (aluma_monthly, aluma_yearly)');
      console.error('[RC][getProductsFromAppStore]       - SUBMIT the app version (not just save)');
      console.error('[RC][getProductsFromAppStore]    3. ⏳ Wait 15-30 minutes for App Store propagation');
      console.error('[RC][getProductsFromAppStore]    4. 🔐 Sign out of App Store in iOS Settings');
      console.error('[RC][getProductsFromAppStore]    5. Test with a sandbox test account');
      console.error('[RC][getProductsFromAppStore]    ========================================');
      console.error('[RC][getProductsFromAppStore]    💡 KEY INSIGHT:');
      console.error('[RC][getProductsFromAppStore]    "Waiting for Review" status alone is NOT enough.');
      console.error('[RC][getProductsFromAppStore]    Products must be part of a SUBMITTED app version.');
      console.error('[RC][getProductsFromAppStore]    Once submitted, they\'re available in sandbox immediately,');
      console.error('[RC][getProductsFromAppStore]    even while waiting for Apple\'s approval.');
      console.error('[RC][getProductsFromAppStore]    ========================================');
    } else if (products.length < productIds.length) {
      const fetchedIds = products.map(p => p.identifier);
      const missingIds = productIds.filter(id => !fetchedIds.includes(id));
      console.warn('[RC][getProductsFromAppStore] ⚠️ Only some products were fetched:', {
        requested: productIds,
        fetched: fetchedIds,
        missing: missingIds,
      });
    } else {
      console.log('[RC][getProductsFromAppStore] ✅ All products successfully fetched from App Store Connect!');
    }

    return products;
  } catch (e) {
    console.error('[RC][getProductsFromAppStore] ❌ Error fetching products directly:', e);
    return [];
  }
}

/** Fetch current offering (server-driven paywall). */
export async function getOfferings() {
  if (!RC_ENABLED || !configured) {
    console.log('[RC][getOfferings] Skipping - RC_ENABLED:', RC_ENABLED, 'configured:', configured);
    return null;
  }
  
  console.log('[RC][getOfferings] Fetching offerings...', {
    expectedProductIds: Object.values(PRODUCT_ID_BY_PLAN),
    expectedPackages: Object.values(PACKAGE_ID_BY_PLAN),
    entitlementId: ENTITLEMENT_ID,
  });

  // First, try to fetch products directly from App Store Connect to verify they exist
  const directProducts = await getProductsFromAppStore();

  try {
    const offerings = await Purchases.getOfferings();
    
    console.log('[RC][getOfferings] Raw offerings response:', {
      hasOfferings: !!offerings,
      allOfferingsCount: offerings ? Object.keys(offerings.all).length : 0,
      allOfferingIds: offerings ? Object.keys(offerings.all) : [],
      currentOfferingId: offerings?.current?.identifier,
      currentOfferingAvailable: !!offerings?.current,
    });

    // Log all available offerings for debugging
    if (offerings?.all && Object.keys(offerings.all).length > 0) {
      console.log('[RC][getOfferings] All available offerings in dashboard:');
      Object.values(offerings.all).forEach((offering: PurchasesOffering) => {
        console.log(`  - Offering ID: "${offering.identifier}"`, {
          isCurrent: offering.identifier === offerings?.current?.identifier,
          packagesCount: offering.availablePackages?.length || 0,
          packages: offering.availablePackages?.map(p => ({
            packageId: p.identifier,
            productId: p.product.identifier,
            productTitle: p.product.title,
          })) || [],
        });
      });
    }

    if (offerings?.current) {
      const current = offerings.current;
      console.log('[RC][getOfferings] ✅ Current offering details:', {
        identifier: current.identifier,
        serverDescription: current.serverDescription,
        availablePackagesCount: current.availablePackages?.length || 0,
        availablePackageIds: current.availablePackages?.map(p => ({
          identifier: p.identifier,
          productId: p.product.identifier,
          productTitle: p.product.title,
          productPrice: p.product.priceString,
        })) || [],
        monthlyPackage: current.monthly ? {
          identifier: current.monthly.identifier,
          productId: current.monthly.product.identifier,
        } : null,
        annualPackage: current.annual ? {
          identifier: current.annual.identifier,
          productId: current.annual.product.identifier,
        } : null,
      });
    } else {
      console.warn('[RC][getOfferings] ⚠️ No current offering found. Available offerings:', offerings ? Object.keys(offerings.all) : 'none');
      if (offerings?.all && Object.keys(offerings.all).length > 0) {
        console.warn('[RC][getOfferings] 💡 Tip: Make sure one of these offerings is set as "current" in RevenueCat dashboard:', Object.keys(offerings.all));
      }
    }

    return offerings.current ?? null;
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.error('[RC][getOfferings] ❌ Error fetching offerings:', {
      error: e,
      errorMessage,
      expectedProductIds: Object.values(PRODUCT_ID_BY_PLAN),
    });
    
      // Provide specific guidance based on the error
      if (errorMessage.includes('products registered in the RevenueCat dashboard could not be fetched')) {
        console.error('[RC][getOfferings] 🔍 DIAGNOSIS: Products exist in RevenueCat but cannot be fetched from App Store Connect.');
        console.error('[RC][getOfferings] 📋 ACTION REQUIRED:');
        console.error('[RC][getOfferings]   1. Product IDs must match exactly:', Object.values(PRODUCT_ID_BY_PLAN));
        console.error('[RC][getOfferings]   2. Products in "Ready to Submit" status need to be:');
        console.error('[RC][getOfferings]      ✅ Created (DONE - aluma_monthly, aluma_yearly exist)');
        console.error('[RC][getOfferings]      ⚠️ SUBMITTED with your app version (REQUIRED for sandbox testing)');
        console.error('[RC][getOfferings]      ⏳ APPROVED (REQUIRED for production only)');
        console.error('[RC][getOfferings]   3. Products must be linked to your app in App Store Connect');
        console.error('[RC][getOfferings]   📝 NOTE: For DEVELOPMENT/SANDBOX: Submit products with your app version.');
        console.error('[RC][getOfferings]       Once submitted, they become available in sandbox for testing.');
        console.error('[RC][getOfferings]       You don\'t need to wait for approval to test in sandbox!');
        
        // If we were able to fetch products directly, show that info
        if (directProducts.length > 0) {
          console.log('[RC][getOfferings] 💡 Good news: Products CAN be fetched directly from App Store Connect!');
          console.log('[RC][getOfferings]    This means products exist and are submitted, RevenueCat should work now.');
        } else {
          console.error('[RC][getOfferings] ⚠️ Products cannot be fetched directly from App Store Connect.');
          console.error('[RC][getOfferings]    This means products are still in "Ready to Submit" status.');
          console.error('[RC][getOfferings]    📋 NEXT STEP: Submit your products with your app version in App Store Connect.');
          console.error('[RC][getOfferings]       After submission (not approval), they\'ll be available for sandbox testing.');
        }
      }
    
    return null;
  }
}

/** Purchase a plan using Offering packages; robustly finds the correct package. */
export async function purchasePlan(plan: PurchasePlan) {
  if (!RC_ENABLED || !configured) {
    // Development no-op mode
    console.log('[RC][purchasePlan] RevenueCat not enabled, returning simulated purchase');
    return { customerInfo: null as CustomerInfo | null, simulated: true };
  }

  console.log('[RC][purchasePlan] Attempting to purchase plan:', {
    plan,
    expectedPackageId: PACKAGE_ID_BY_PLAN[plan],
    expectedProductId: PRODUCT_ID_BY_PLAN[plan],
  });

  const offering = await getOfferings();
  if (!offering) {
    console.error('[RC][purchasePlan] ❌ Offerings not available');
    throw new Error('Offerings not available. Make sure products exist and the default offering is set.');
  }

  const target = findPackageByPlan(offering, plan);
  if (!target) {
    console.error('[RC][purchasePlan] ❌ Package not found for plan:', {
      plan,
      expectedPackageId: PACKAGE_ID_BY_PLAN[plan],
      expectedProductId: PRODUCT_ID_BY_PLAN[plan],
      availablePackages: (offering.availablePackages || []).map(p => ({
        identifier: p.identifier,
        productId: p.product.identifier,
      })),
    });
    throw new Error(`Package not found for plan: ${plan}`);
  }

  console.log('[RC][purchasePlan] Found package to purchase:', {
    packageIdentifier: target.identifier,
    productId: target.product.identifier,
    productTitle: target.product.title,
    productPrice: target.product.priceString,
  });

  const { customerInfo } = await Purchases.purchasePackage(target);
  console.log('[RC][purchasePlan] ✅ Purchase successful');
  return { customerInfo, simulated: false };
}

/** Restore purchases (e.g., “Restore” button). */
export async function restorePurchases() {
  if (!RC_ENABLED || !configured) {return { customerInfo: null, simulated: true };}

  const info = await Purchases.restorePurchases();
  return { customerInfo: info, simulated: false };
}

/** Safe wrapper for current customer info. */
export async function getCustomerInfoSafe() {
  if (!RC_ENABLED || !configured) {return null;}
  try {
    return await Purchases.getCustomerInfo();
  } catch (_e) {
    return null;
  }
}

/** Checks if the entitlement is active. */
export function isPremium(info?: CustomerInfo | null) {
  if (!info) {return false;}
  const ent = info.entitlements.active[ENTITLEMENT_ID];
  return !!ent;
}

/** 
 * Check and return current subscription status from RevenueCat.
 * Works for both registered and anonymous users.
 * Returns null if RevenueCat is not enabled or not configured.
 */
export async function checkSubscriptionStatus(): Promise<{
  isPremium: boolean;
  plan?: 'monthly' | 'yearly';
  expiry?: string;
} | null> {
  if (!RC_ENABLED || !configured) {
    return null;
  }

  try {
    const info = await getCustomerInfoSafe();
    const premium = isPremium(info);
    
    if (!premium || !info) {
      return { isPremium: false };
    }

    const entitlement = info.entitlements.active[ENTITLEMENT_ID];
    if (!entitlement) {
      return { isPremium: false };
    }

    const expiry = entitlement.expirationDate ?? undefined;
    const productId = entitlement.productIdentifier || '';
    
    let plan: 'monthly' | 'yearly' | undefined;
    if (productId.includes('yearly') || productId.includes('annual')) {
      plan = 'yearly';
    } else if (productId.includes('monthly')) {
      plan = 'monthly';
    }

    return {
      isPremium: true,
      plan,
      expiry,
    };
  } catch (e) {
    console.error('[RC][checkSubscriptionStatus] Error:', e);
    return null;
  }
}

/** Utility: get a list of packages (for showing real localized prices/titles). */
export async function getCurrentPackages() {
  const offering = await getOfferings();
  if (!offering) {return [];}
  const all = [
    ...(offering.availablePackages ?? []),
    offering.monthly, offering.annual,
    offering.sixMonth, offering.threeMonth,
    offering.twoMonth, offering.weekly,
  ].filter(Boolean) as PurchasesPackage[];

  return all;
}

/* --------------------------- helpers --------------------------- */

/** Robust finder: match by RC package identifier and fallback to store productID (SKU). */
function findPackageByPlan(
  offering: PurchasesOffering,
  plan: PurchasePlan
): PurchasesPackage | undefined {
  const all = [
    ...(offering.availablePackages ?? []),
    offering.monthly, offering.annual,
    offering.sixMonth, offering.threeMonth,
    offering.twoMonth, offering.weekly,
  ].filter(Boolean) as PurchasesPackage[];

  // 1) Try by package identifier ($rc_monthly / $rc_annual)
  const byPkgId = all.find(p => p.identifier === PACKAGE_ID_BY_PLAN[plan]);
  if (byPkgId) {return byPkgId;}

  // 2) Fallback by store SKU
  const sku = PRODUCT_ID_BY_PLAN[plan];
  return all.find(p => p.product.identifier === sku);
}
