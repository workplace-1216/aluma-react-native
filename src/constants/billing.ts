// src/constants/billing.ts

/** Entitlement identifier as created in RevenueCat (case-sensitive). */
export const ENTITLEMENT_ID = 'Premium';

/** Product IDs (SKUs) as created in App Store Connect / Play Console / .storekit */
export const PRODUCT_MONTHLY = 'aluma_monthly';
export const PRODUCT_YEARLY  = 'aluma_yearly';

/** RevenueCat Offering identifier you set as current in the dashboard. */
export const OFFERING_ID = 'Pro';

/**
 * Preferred package identifiers in RevenueCat.
 * If you keep the built-in ones ($rc_monthly / $rc_annual), this works out of the box.
 */
export const PACKAGE_ID_BY_PLAN = {
  monthly: '$rc_monthly',
  yearly:  '$rc_annual',
} as const;

/** Convenience map by plan -> product SKU (used as fallback match). */
export const PRODUCT_ID_BY_PLAN = {
  monthly: PRODUCT_MONTHLY,
  yearly:  PRODUCT_YEARLY,
} as const;

export type PurchasePlan = keyof typeof PACKAGE_ID_BY_PLAN;
