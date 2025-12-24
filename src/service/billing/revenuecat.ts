// src/service/billing/revenuecat.ts
import { Platform } from 'react-native';

// Import Purchases directly like the working test screen
import Purchases, {
  PurchasesPackage,
  PurchasesOffering,
  CustomerInfo,
} from 'react-native-purchases';

// Purchases is already imported directly - no need for lazy loading

import { ENTITLEMENT_ID, PACKAGE_ID_BY_PLAN, PRODUCT_ID_BY_PLAN, PurchasePlan } from '../../constants/billing';

import { RC_API_KEY_IOS, RC_API_KEY_ANDROID, RC_ENABLED } from '../../utils/env';
// Removed react-native-iap dependency - using RevenueCat only

let configured = false;

/** Check if RevenueCat is enabled for the current platform */
function isRevenueCatEnabledForPlatform(): boolean {
  if (!RC_ENABLED) {
    return false;
  }
  const apiKey = Platform.OS === 'ios' ? RC_API_KEY_IOS : RC_API_KEY_ANDROID;
  return !!apiKey && apiKey.trim().length > 0;
}

// Removed isPurchasesAvailable - use direct Purchases checks like test screen

// Removed getPurchasesInstance and waitForNativeModuleReady - use Purchases directly like test screen

/** Initialize RevenueCat (simple like test screen). */
export async function initRevenueCat(appUserId?: string) {
  if (!isRevenueCatEnabledForPlatform() || configured) {
    return;
  }

  try {
    const apiKey = Platform.OS === 'ios' ? RC_API_KEY_IOS : RC_API_KEY_ANDROID;
    if (!apiKey || apiKey.trim().length === 0) {
      return;
    }

    // Configure RevenueCat exactly like the test screen
    await Purchases.configure({ apiKey: apiKey.trim() });
    
    // Set initial user ID if provided (like test screen does)
    if (appUserId && appUserId.trim()) {
      await Purchases.logIn(appUserId.trim());
    }

    configured = true;
  } catch (err: any) {
    console.error('[RC] Failed to configure RevenueCat:', err.message || 'Unknown error');
    configured = false;
  }
}

/** Link your own user id (simple like test screen). */
export async function identifyRevenueCat(appUserId?: string) {
  if (!RC_ENABLED || !configured || !appUserId) {
    return;
  }

  try {
    await Purchases.logIn(appUserId);
  } catch (err: any) {
    console.error('[RC] Failed to identify user:', err.message || 'Unknown error');
  }
}

/** Fetch products from RevenueCat offerings (simple like test screen). */
export async function getProductsFromAppStore() {
  if (!RC_ENABLED || !configured) {
    return [];
  }

  try {
    // Use getOfferings() like the test screen - this works for both iOS and Android
    const offerings = await Purchases.getOfferings();
    const products: Array<{
      identifier: string; // Package ID: $rc_monthly, $rc_annual
      productId: string; // Actual product ID: aluma_monthly, aluma_yearly
      title: string | null;
      priceString: string | null;
      description: string | null;
      subscriptionPeriod?: string | null;
      source: 'revenuecat';
      platform: 'ios' | 'android';
      raw: unknown;
    }> = [];

    if (offerings.current !== null) {
      const packages = offerings.current.availablePackages;
      console.log(`[RC][getProductsFromAppStore] 📱 Platform: ${Platform.OS.toUpperCase()}`);
      console.log(`[RC][getProductsFromAppStore] 📦 Found ${packages.length} packages in current offering`);
      
      packages.forEach((pkg: PurchasesPackage) => {
        const product = {
          identifier: pkg.identifier, // Package ID: $rc_monthly, $rc_annual
          productId: pkg.product.identifier, // Actual product ID: aluma_monthly, aluma_yearly
          title: pkg.product.title || pkg.identifier,
          description: pkg.product.description || '',
          priceString: pkg.product.priceString || null,
          subscriptionPeriod: pkg.product.subscriptionPeriod || null,
          source: 'revenuecat' as const,
          platform: Platform.OS as 'ios' | 'android',
          raw: pkg,
        };
        
        products.push(product);
        
        // Log each product with platform info
        console.log(`[RC][getProductsFromAppStore] ✅ Product [${Platform.OS.toUpperCase()}]:`, {
          packageIdentifier: product.identifier, // $rc_monthly, $rc_annual
          productId: product.productId, // aluma_monthly, aluma_yearly
          title: product.title,
          price: product.priceString,
          packageType: pkg.packageType,
        });
      });
    } else {
      console.warn(`[RC][getProductsFromAppStore] ⚠️ No current offering found for ${Platform.OS.toUpperCase()}`);
    }

    console.log(`[RC][getProductsFromAppStore] 📊 Summary: ${products.length} products for ${Platform.OS.toUpperCase()}`);
    return products;
  } catch (err: any) {
    console.error(`[RC][getProductsFromAppStore] ❌ Error [${Platform.OS.toUpperCase()}]:`, err.message || 'Failed to fetch products');
    return [];
  }
}

/** Fetch current offering (simple like test screen). */
export async function getOfferings() {
  if (!RC_ENABLED || !configured) {
    return null;
  }

  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (err: any) {
    console.error('[RC] Failed to get offerings:', err.message || 'Unknown error');
    return null;
  }
}

/** Purchase a plan using Offering packages; robustly finds the correct package. */
export async function purchasePlan(plan: PurchasePlan) {
  if (!isRevenueCatEnabledForPlatform() || !configured) {
    // Development no-op mode
    const reason = !isRevenueCatEnabledForPlatform() 
      ? `RevenueCat API key missing for ${Platform.OS}` 
      : 'RevenueCat not configured';
    console.log(`[RC][purchasePlan] ${reason}, returning simulated purchase`);
    console.log(`[RC][purchasePlan] RC_ENABLED: ${RC_ENABLED}, configured: ${configured}, platform: ${Platform.OS}`);
    console.log(`[RC][purchasePlan] iOS key exists: ${!!RC_API_KEY_IOS}, Android key exists: ${!!RC_API_KEY_ANDROID}`);
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

  // Use Purchases directly like test screen
  if (!Purchases || typeof Purchases.purchasePackage !== 'function') {
    throw new Error('Purchases.purchasePackage not available');
  }
  const { customerInfo } = await Purchases.purchasePackage(target);
  console.log('[RC][purchasePlan] ✅ Purchase successful');
  return { customerInfo, simulated: false };
}

/** Restore purchases (e.g., “Restore” button). */
export async function restorePurchases() {
  if (!RC_ENABLED || !configured) {return { customerInfo: null, simulated: true };}

  // Use Purchases directly like test screen
  if (!Purchases || typeof Purchases.restorePurchases !== 'function') {
    throw new Error('Purchases.restorePurchases not available');
  }
  const info = await Purchases.restorePurchases();
  return { customerInfo: info, simulated: false };
}

/** Safe wrapper for current customer info (simple like test screen). */
export async function getCustomerInfoSafe() {
  if (!RC_ENABLED || !configured) {
    return null;
  }
  
  try {
    return await Purchases.getCustomerInfo();
  } catch (err: any) {
    console.error('[RC] Failed to get customer info:', err.message || 'Unknown error');
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
