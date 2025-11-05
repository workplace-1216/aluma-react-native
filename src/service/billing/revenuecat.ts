// src/service/billing/revenuecat.ts
import Purchases, {
  LOG_LEVEL,
  PurchasesPackage,
  PurchasesOffering,
  CustomerInfo,
} from 'react-native-purchases';
import { Platform } from 'react-native';

import {
  ENTITLEMENT_ID,
  PACKAGE_ID_BY_PLAN,
  PRODUCT_ID_BY_PLAN,
  PurchasePlan,
} from '../../constants/billing';

import { RC_API_KEY_IOS, RC_API_KEY_ANDROID, RC_ENABLED } from '../../utils/env';

let configured = false;

/** Initialize RevenueCat as early as possible (App bootstrap). */
export async function initRevenueCat(appUserId?: string) {
  try {
    if (!RC_ENABLED || configured) {return;}

    const apiKey = Platform.OS === 'ios' ? RC_API_KEY_IOS : RC_API_KEY_ANDROID;
    if (!apiKey) {
      console.warn('[RC] Missing API key for current platform; skipping configure.');
      return;
    }

    // Enable detailed logs while developing
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);

    await Purchases.configure({
      apiKey,
      appUserID: appUserId || undefined,
      // observerMode: false, // default
    });

    configured = true;
    console.log('[RC] configure() done. Platform:', Platform.OS);
  } catch (e) {
    console.error('[RC] initRevenueCat error:', e);
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

/** Simple smoke test: ensure StoreKit/Google Billing returns the SKUs. */
export async function smokeTestStoreKit() {
  try {
    const SKUS = [PRODUCT_ID_BY_PLAN.monthly, PRODUCT_ID_BY_PLAN.yearly];
    const prods = await Purchases.getProducts(SKUS);

    console.log(
      '[RC][SMOKE] Store products:',
      prods.map(p => ({
        id: p.identifier,
        title: p.title,
        price: p.priceString,
      }))
    );

    if (!prods.length) {
      console.warn(
        '[RC][SMOKE] No products returned. On iOS simulator, make sure a StoreKit Configuration (.storekit) with these same productIDs is selected in: Product → Scheme → Edit Scheme → Run → Options.'
      );
    }
    return prods;
  } catch (e) {
    console.error('[RC][SMOKE] getProducts error:', e);
    return [];
  }
}

/** Fetch current offering (server-driven paywall). */
export async function getOfferings() {
  if (!RC_ENABLED || !configured) {return null;}
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current ?? null;
  } catch (e) {
    console.error('[RC] getOfferings error:', e);
    return null;
  }
}

/** Purchase a plan using Offering packages; robustly finds the correct package. */
export async function purchasePlan(plan: PurchasePlan) {
  if (!RC_ENABLED || !configured) {
    // Development no-op mode
    return { customerInfo: null as CustomerInfo | null, simulated: true };
  }

  const offering = await getOfferings();
  if (!offering) {
    throw new Error('Offerings not available. Make sure products exist and the default offering is set.');
  }

  const target = findPackageByPlan(offering, plan);
  if (!target) {
    throw new Error(`Package not found for plan: ${plan}`);
  }

  const { customerInfo } = await Purchases.purchasePackage(target);
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
