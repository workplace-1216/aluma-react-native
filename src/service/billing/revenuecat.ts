// src/service/billing/revenuecat.ts
import { Platform, InteractionManager, NativeModules } from 'react-native';

// Lazy load Purchases to handle cases where native module isn't loaded
let Purchases: any = null;
let LOG_LEVEL: any = null;
let PurchasesPackage: any = null;
let PurchasesOffering: any = null;
let CustomerInfo: any = null;

// Try to load Purchases module
function loadPurchasesModule() {
  if (Purchases !== null && Purchases !== undefined) {
    return Purchases; // Already loaded or attempted
  }
  
  try {
    const purchasesModule = require('react-native-purchases');
    Purchases = purchasesModule.default || purchasesModule;
    LOG_LEVEL = purchasesModule.LOG_LEVEL;
    PurchasesPackage = purchasesModule.PurchasesPackage;
    PurchasesOffering = purchasesModule.PurchasesOffering;
    CustomerInfo = purchasesModule.CustomerInfo;
    
    console.log('[RC][loadPurchasesModule] Module structure:', {
      hasDefault: !!purchasesModule.default,
      hasConfigure: Purchases && typeof Purchases.configure === 'function',
      purchasesType: typeof Purchases,
      isObject: typeof Purchases === 'object',
      keys: Purchases && typeof Purchases === 'object' ? Object.keys(Purchases).slice(0, 10) : 'N/A',
    });
    
    // Also check if native module is actually linked
    if (NativeModules && NativeModules.RNPurchases) {
      console.log('[RC] ✅ Purchases native module is linked');
    } else {
      console.warn('[RC] ⚠️ Purchases native module not found in NativeModules');
      console.warn('[RC] Available NativeModules:', NativeModules ? Object.keys(NativeModules).filter(k => k.toLowerCase().includes('purchase') || k.toLowerCase().includes('revenue')).slice(0, 10) : 'N/A');
    }
    
    if (Purchases && typeof Purchases.configure === 'function') {
      console.log('[RC] ✅ Purchases module loaded successfully with configure method');
    } else {
      console.warn('[RC] ⚠️ Purchases module loaded but configure method not found');
    }
    
    return Purchases;
  } catch (e) {
    console.error('[RC] ❌ Failed to load Purchases module:', e);
    Purchases = undefined; // Mark as failed
    return null;
  }
}

import { ENTITLEMENT_ID, PACKAGE_ID_BY_PLAN, PRODUCT_ID_BY_PLAN, PurchasePlan } from '../../constants/billing';

import { RC_API_KEY_IOS, RC_API_KEY_ANDROID, RC_ENABLED } from '../../utils/env';
import { fetchSubscriptions, supportsStoreKitInAppPurchases } from './iap';

let configured = false;

/** Check if RevenueCat is enabled for the current platform */
function isRevenueCatEnabledForPlatform(): boolean {
  if (!RC_ENABLED) {
    return false;
  }
  const apiKey = Platform.OS === 'ios' ? RC_API_KEY_IOS : RC_API_KEY_ANDROID;
  return !!apiKey && apiKey.trim().length > 0;
}

/** Safely check if Purchases module is available */
function isPurchasesAvailable(purchasesInstance?: any): boolean {
  try {
    // Use provided instance or load the module
    const purchases = purchasesInstance || loadPurchasesModule();
    if (!purchases) {
      return false;
    }
    
    // Check if it's a valid object with required methods
    const isValid = (
      typeof purchases === 'object' &&
      purchases !== null &&
      typeof purchases.configure === 'function'
    );
    
    if (!isValid) {
      console.log('[RC][isPurchasesAvailable] Module check failed:', {
        type: typeof purchases,
        isNull: purchases === null,
        hasConfigure: typeof purchases.configure,
        availableKeys: purchases && typeof purchases === 'object' ? Object.keys(purchases).slice(0, 10) : 'N/A',
      });
    }
    
    return isValid;
  } catch (e) {
    console.error('[RC] Error checking Purchases availability:', e);
    return false;
  }
}

/** Get the Purchases instance, loading it if necessary */
function getPurchasesInstance(): any {
  return loadPurchasesModule();
}

/** Safely wait for interactions and add delay for native module stability */
async function waitForNativeModuleReady(): Promise<void> {
  await new Promise<void>((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      resolve();
    });
  });
  // Additional delay to ensure native module is stable
  await new Promise(resolve => setTimeout(resolve, 300));
}

/** Initialize RevenueCat as early as possible (App bootstrap). */
export async function initRevenueCat(appUserId?: string) {
  console.log('[RC][initRevenueCat] Starting initialization...', {
    platform: Platform.OS,
    RC_ENABLED,
    configured,
    isEnabledForPlatform: isRevenueCatEnabledForPlatform(),
    iOSKeyExists: !!RC_API_KEY_IOS,
    androidKeyExists: !!RC_API_KEY_ANDROID,
  });

  try {
    if (!isRevenueCatEnabledForPlatform() || configured) {
      const reason = !isRevenueCatEnabledForPlatform()
        ? `RevenueCat API key missing for ${Platform.OS}`
        : 'already configured';
      console.log(`[RC] RevenueCat disabled or ${reason}. RC_ENABLED: ${RC_ENABLED}, configured: ${configured}, platform: ${Platform.OS}`);
      console.log(`[RC] iOS key exists: ${!!RC_API_KEY_IOS}, Android key exists: ${!!RC_API_KEY_ANDROID}`);
      return;
    }

    const apiKey = Platform.OS === 'ios' ? RC_API_KEY_IOS : RC_API_KEY_ANDROID;
    console.log('[RC][initRevenueCat] Checking API key...', {
      platform: Platform.OS,
      apiKeyExists: !!apiKey,
      apiKeyLength: apiKey?.length || 0,
      apiKeyPreview: apiKey ? apiKey.substring(0, 10) + '...' : 'none',
    });

    if (!apiKey || apiKey.trim().length === 0) {
      console.warn('[RC] Missing API key for current platform; skipping configure. Platform:', Platform.OS);
      console.warn(`[RC] iOS key: ${RC_API_KEY_IOS ? 'exists' : 'missing'}, Android key: ${RC_API_KEY_ANDROID ? 'exists' : 'missing'}`);
      return;
    }

    // Validate API key format
    const trimmedKey = apiKey.trim();
    const expectedPrefix = Platform.OS === 'ios' ? 'appl_' : 'goog_';
    console.log('[RC][initRevenueCat] Validating API key format...', {
      trimmedKeyLength: trimmedKey.length,
      expectedPrefix,
      actualPrefix: trimmedKey.substring(0, 5),
      isValid: trimmedKey.startsWith(expectedPrefix),
    });

    if (!trimmedKey.startsWith(expectedPrefix)) {
      console.error(`[RC] ❌ Invalid API key format for ${Platform.OS}. Expected prefix: ${expectedPrefix}`);
      console.error(`[RC] Key starts with: ${trimmedKey.substring(0, 5)}`);
      console.error('[RC] Please verify your API key in RevenueCat dashboard');
      return;
    }

    console.log('[RC][initRevenueCat] API key validation passed');

    console.log('[RC] Initializing RevenueCat...', {
      platform: Platform.OS,
      apiKeyPrefix: trimmedKey.substring(0, 10) + '...',
      apiKeyLength: trimmedKey.length,
      appUserId: appUserId || 'anonymous',
      expectedProducts: Object.values(PRODUCT_ID_BY_PLAN),
      expectedPackages: Object.values(PACKAGE_ID_BY_PLAN),
      entitlementId: ENTITLEMENT_ID,
    });

    // Load and check if Purchases module is available
    const purchases = loadPurchasesModule();
    console.log('[RC][initRevenueCat] Purchases module loaded:', {
      purchasesExists: !!purchases,
      purchasesType: typeof purchases,
      isNull: purchases === null,
      isUndefined: purchases === undefined,
      hasConfigure: purchases && typeof purchases.configure === 'function',
      hasSetLogLevel: purchases && typeof purchases.setLogLevel === 'function',
      availableMethods: purchases && typeof purchases === 'object' ? Object.keys(purchases).slice(0, 20) : 'N/A',
    });
    
    if (!purchases) {
      console.error('[RC] ❌ Purchases module not available - failed to load');
      console.error('[RC] Check: 1) Is react-native-purchases installed? 2) Is native module linked? 3) Rebuild app after installing');
      configured = false;
      return;
    }
    
    if (typeof purchases !== 'object' || purchases === null) {
      console.error('[RC] ❌ Purchases is not a valid object:', typeof purchases);
      configured = false;
      return;
    }
    
    if (typeof purchases.configure !== 'function') {
      console.error('[RC] ❌ Purchases.configure function not available');
      console.error('[RC] Purchases type:', typeof purchases);
      console.error('[RC] Available methods:', purchases && typeof purchases === 'object' ? Object.keys(purchases) : 'N/A');
      console.error('[RC] Purchases value:', purchases);
      configured = false;
      return;
    }
    
    console.log('[RC][initRevenueCat] ✅ Purchases module is valid and ready to configure');
    
    // Enable detailed logs while developing (with error handling)
    try {
      if (purchases && typeof purchases.setLogLevel === 'function' && LOG_LEVEL) {
        purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }
    } catch (logError) {
      console.warn('[RC] ⚠️ Failed to set log level (non-fatal):', logError);
    }

    console.log('[RC][initRevenueCat] Calling Purchases.configure()...');
    
    try {
      // Wait for native module to be ready
      await waitForNativeModuleReady();
      
      await purchases.configure({
        apiKey: trimmedKey,
        appUserID: appUserId || undefined,
        // observerMode: false, // default
      });

      configured = true;
      console.log('[RC] ✅ configure() done successfully. Platform:', Platform.OS);
      console.log('[RC] ✅ configured flag set to:', configured);
    } catch (configureError) {
      console.error('[RC] ❌ Purchases.configure() failed:', configureError);
      console.error('[RC] Error type:', configureError instanceof Error ? configureError.constructor.name : typeof configureError);
      console.error('[RC] Error message:', configureError instanceof Error ? configureError.message : String(configureError));
      if (configureError instanceof Error && configureError.stack) {
        console.error('[RC] Stack trace:', configureError.stack);
      }
      configured = false;
      // Don't rethrow - allow app to continue without RevenueCat
      return;
    }
  } catch (e) {
    console.error('[RC] ❌ initRevenueCat error:', e);
    console.error('[RC] Error type:', e instanceof Error ? e.constructor.name : typeof e);
    console.error('[RC] Error message:', e instanceof Error ? e.message : String(e));
    if (e instanceof Error && e.stack) {
      console.error('[RC] Stack trace:', e.stack);
    }
    // Don't rethrow - allow app to continue without RevenueCat
    configured = false;
  }
}

/** Link your own user id (optional but recommended if you have login). */
export async function identifyRevenueCat(appUserId?: string) {
  if (!RC_ENABLED || !configured) {
    console.log('[RC][identifyRevenueCat] Skipping - RC_ENABLED:', RC_ENABLED, 'configured:', configured);
    return;
  }
  if (!appUserId) {
    console.log('[RC][identifyRevenueCat] Skipping - no appUserId provided');
    return;
  }

  try {
    console.log('[RC][identifyRevenueCat] Calling Purchases.logIn with userId:', appUserId);
    
    const purchases = getPurchasesInstance();
    
    // Check if Purchases module and logIn function are available
    if (!purchases || !isPurchasesAvailable(purchases)) {
      console.error('[RC][identifyRevenueCat] ❌ Purchases module not available');
      return;
    }
    
    if (typeof purchases.logIn !== 'function') {
      console.error('[RC][identifyRevenueCat] ❌ Purchases.logIn function not available');
      return;
    }
    
    // Wait for native module to be ready
    await waitForNativeModuleReady();
    
    const result = await purchases.logIn(appUserId);
    if (result?.created) {
      console.log('[RC] logIn(): purchases migrated to user id:', appUserId);
    } else {
      console.log('[RC] logIn(): user already logged in:', appUserId);
    }
    console.log('[RC][identifyRevenueCat] ✅ logIn completed successfully');
  } catch (e) {
    console.error('[RC][identifyRevenueCat] ❌ logIn error:', e);
    console.error('[RC] Error type:', e instanceof Error ? e.constructor.name : typeof e);
    console.error('[RC] Error message:', e instanceof Error ? e.message : String(e));
    if (e instanceof Error && e.stack) {
      console.error('[RC] Stack trace:', e.stack);
    }
    // Don't rethrow - allow app to continue
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
            const purchases = getPurchasesInstance();
            if (!purchases || typeof purchases.getProducts !== 'function') {
              console.warn('[RC][getProductsFromAppStore] ⚠️ Purchases.getProducts not available');
              return [];
            }
            const purchasesProducts = await purchases.getProducts(productIds);
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
    const purchases = getPurchasesInstance();
    if (!purchases || typeof purchases.getOfferings !== 'function') {
      throw new Error('Purchases.getOfferings not available');
    }
    const offerings = await purchases.getOfferings();
    
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

  const purchases = getPurchasesInstance();
  if (!purchases || typeof purchases.purchasePackage !== 'function') {
    throw new Error('Purchases.purchasePackage not available');
  }
  const { customerInfo } = await purchases.purchasePackage(target);
  console.log('[RC][purchasePlan] ✅ Purchase successful');
  return { customerInfo, simulated: false };
}

/** Restore purchases (e.g., “Restore” button). */
export async function restorePurchases() {
  if (!RC_ENABLED || !configured) {return { customerInfo: null, simulated: true };}

  const purchases = getPurchasesInstance();
  if (!purchases || typeof purchases.restorePurchases !== 'function') {
    throw new Error('Purchases.restorePurchases not available');
  }
  const info = await purchases.restorePurchases();
  return { customerInfo: info, simulated: false };
}

/** Safe wrapper for current customer info. */
export async function getCustomerInfoSafe() {
  if (!RC_ENABLED || !configured) {
    console.log('[RC][getCustomerInfoSafe] Skipping - RC_ENABLED:', RC_ENABLED, 'configured:', configured);
    return null;
  }
  
  try {
    console.log('[RC][getCustomerInfoSafe] Calling Purchases.getCustomerInfo()...');
    
    const purchases = getPurchasesInstance();
    
    // Check if Purchases module and getCustomerInfo function are available
    if (!purchases || !isPurchasesAvailable(purchases)) {
      console.error('[RC][getCustomerInfoSafe] ❌ Purchases module not available');
      return null;
    }
    
    if (typeof purchases.getCustomerInfo !== 'function') {
      console.error('[RC][getCustomerInfoSafe] ❌ Purchases.getCustomerInfo function not available');
      return null;
    }
    
    // Wait for native module to be ready
    await waitForNativeModuleReady();
    
    const info = await purchases.getCustomerInfo();
    console.log('[RC][getCustomerInfoSafe] ✅ getCustomerInfo completed successfully');
    return info;
  } catch (e) {
    console.error('[RC][getCustomerInfoSafe] ❌ getCustomerInfo error:', e);
    console.error('[RC] Error type:', e instanceof Error ? e.constructor.name : typeof e);
    console.error('[RC] Error message:', e instanceof Error ? e.message : String(e));
    if (e instanceof Error && e.stack) {
      console.error('[RC] Stack trace:', e.stack);
    }
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
