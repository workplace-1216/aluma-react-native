import React, { useEffect, useState } from 'react';
import { heightToDP } from 'react-native-responsive-screens';
import BottomSheet from '../../../UI/BottomSheet';
import PlanSelectionSection from '../../../UI/PlanSelectionSection';
import { RenderSubscriptionBottomSheetProps } from './types';
import {
  features,
  plans as defaultPlans,
} from '../../../../utils/subscriptionsData';
import { isSmallAppleScreen } from '../../../../utils/isSmallAppleScreen';
import { SubscriptionPlan, PlanCard } from '../../../../utils/types';
import { getProductsFromAppStore } from '../../../../service/billing/revenuecat';
import { PRODUCT_ID_BY_PLAN } from '../../../../constants/billing';
import { RC_ENABLED } from '../../../../utils/env';

type Props = RenderSubscriptionBottomSheetProps & {
  disableClose?: boolean;
  canPurchase?: boolean;
  loading?: boolean;
};

const RenderSubscriptionBottomSheet = ({
  isSubscription,
  setIsSubscription,
  selectedPlan,
  setSelectedPlan,
  handleSubscribe,
  isTrialActive = false,
  disableClose = false,
  canPurchase = true,
  loading = false,
}: Props) => {
  const [hasPlanSelection, setHasPlanSelection] = useState(false);
  const [plans, setPlans] = useState<PlanCard[]>(defaultPlans);
  const [isFetchingPrices, setIsFetchingPrices] = useState(false);
  const [productsReady, setProductsReady] = useState(false);

  // Fetch subscription prices from RevenueCat when modal is requested to open
  // Reset plans to default when modal closes
  useEffect(() => {
    if (!isSubscription) {
      setPlans(defaultPlans);
      setProductsReady(false);
      setIsFetchingPrices(false);
    }
  }, [isSubscription]);

  // Fetch subscription prices from RevenueCat when modal is requested to open
  useEffect(() => {
    if (!isSubscription || !RC_ENABLED) {
      setProductsReady(false);
      return;
    }

    const fetchPrices = async () => {
      setIsFetchingPrices(true);
      setProductsReady(false);

      try {
        console.log(
          '[RenderSubscriptionBottomSheet] Fetching prices from RevenueCat...',
        );
        const products = await getProductsFromAppStore();

        if (products && products.length > 0) {
          console.log(
            '[RenderSubscriptionBottomSheet] ✅ Fetched products:',
            products,
          );

          // Log each product's details for debugging
          products.forEach((p, idx) => {
            console.log(`[RenderSubscriptionBottomSheet] Product [${idx}]:`, {
              identifier: p.identifier,
              productId: p.productId,
              priceString: p.priceString,
              title: p.title,
            });
          });

          // Map RevenueCat products to PlanCard format
          const updatedPlans: PlanCard[] = defaultPlans.map(defaultPlan => {
            // Try to find product by package identifier first ($rc_monthly, $rc_annual)
            const packageId =
              defaultPlan.id === 'monthly' ? '$rc_monthly' : '$rc_annual';
            let product = products.find(p => p.identifier === packageId);

            console.log(
              `[RenderSubscriptionBottomSheet] Looking for ${defaultPlan.id} plan:`,
              {
                packageId,
                foundByPackage: !!product,
                productIdentifier: product?.identifier,
                productPrice: product?.priceString,
              },
            );

            // If not found by package ID, try by product ID (aluma_monthly, aluma_yearly)
            if (!product) {
              const productId = PRODUCT_ID_BY_PLAN[defaultPlan.id];
              product = products.find(p => p.productId === productId);
              console.log(
                `[RenderSubscriptionBottomSheet] Trying productId ${productId}:`,
                {
                  foundByProductId: !!product,
                  productIdentifier: product?.identifier,
                  productPrice: product?.priceString,
                },
              );
            }

            if (product) {
              // Update price with real price from RevenueCat (e.g., "Rs 1,450")
              const priceString = product.priceString;

              if (priceString) {
                // Determine period suffix
                const periodSuffix =
                  defaultPlan.id === 'monthly' ? '/month' : '/year';

                // Update features with real price if monthly
                const updatedFeatures =
                  defaultPlan.id === 'monthly'
                    ? [
                        `7 days free, then ${priceString}${periodSuffix}`,
                        'Automatically renews each month',
                      ]
                    : defaultPlan.features;

                console.log(
                  `[RenderSubscriptionBottomSheet] ✅ Updated ${defaultPlan.id} plan: ${priceString}${periodSuffix}`,
                );

                return {
                  ...defaultPlan,
                  price: `${priceString}${periodSuffix}`,
                  features: updatedFeatures,
                };
              } else {
                console.warn(
                  `[RenderSubscriptionBottomSheet] ⚠️ Product found for ${defaultPlan.id} but priceString is null/empty`,
                  {
                    productIdentifier: product.identifier,
                    productId: product.productId,
                    productTitle: product.title,
                  },
                );
              }
            }

            console.warn(
              `[RenderSubscriptionBottomSheet] ⚠️ Product not found for ${defaultPlan.id}. Available products:`,
              products.map(p => ({
                identifier: p.identifier,
                productId: p.productId,
                price: p.priceString,
              })),
            );
            // Fallback to default if product not found
            return defaultPlan;
          });

          // Check if we actually updated any plans with real prices
          const hasRealPrices = updatedPlans.some(
            plan =>
              plan.price !== defaultPlans.find(p => p.id === plan.id)?.price,
          );

          setPlans(updatedPlans);
          console.log(
            '[RenderSubscriptionBottomSheet] ✅ Updated plans with RevenueCat prices:',
            updatedPlans.map(p => ({
              id: p.id,
              price: p.price,
              title: p.title,
            })),
          );
          console.log(
            `[RenderSubscriptionBottomSheet] Has real prices: ${hasRealPrices}`,
          );
        } else {
          console.warn(
            '[RenderSubscriptionBottomSheet] ⚠️ No products fetched, using default prices',
          );
          setPlans(defaultPlans);
        }
      } catch (error) {
        console.error(
          '[RenderSubscriptionBottomSheet] ❌ Error fetching prices:',
          error,
        );
        // Fallback to default plans on error
        setPlans(defaultPlans);
      } finally {
        setIsFetchingPrices(false);
        // Add a small delay to ensure state is updated and UI is ready
        setTimeout(() => {
          setProductsReady(true);
          console.log(
            '[RenderSubscriptionBottomSheet] ✅ Products ready, opening modal',
          );
        }, 500); // Increased delay to ensure state updates are complete
      }
    };

    fetchPrices();
  }, [isSubscription]);

  useEffect(() => {
    if (!isSubscription) {
      setHasPlanSelection(false);
      return;
    }
    if (!isTrialActive) {
      setHasPlanSelection(true);
    } else {
      setHasPlanSelection(false);
    }
  }, [isSubscription, isTrialActive]);

  const handleClose = () => {
    if (!disableClose) {
      setIsSubscription(false);
    }
  };

  const handlePlanSelect = (planId: SubscriptionPlan) => {
    setHasPlanSelection(true);
    setSelectedPlan(planId);
  };

  const shouldShowTrialCta = isTrialActive && !hasPlanSelection;
  const ctaLabel = shouldShowTrialCta ? '7 Days Free Trial' : 'Continue';
  const onPrimaryAction = shouldShowTrialCta
    ? handleClose
    : () => handleSubscribe();
  const displaySelectedPlan = hasPlanSelection ? selectedPlan : null;

  // Only open the modal after products are loaded (or if RC is disabled)
  const shouldOpenModal = isSubscription && (productsReady || !RC_ENABLED);

  return (
    <BottomSheet
      onClose={handleClose}
      open={shouldOpenModal}
      disableClose={disableClose}
      showCloseButton={false}
      height={heightToDP(isSmallAppleScreen ? 75 : 70)}
      title={
        disableClose
          ? 'Your free trial has ended. Perfect time to choose your Aluma Breath subscription plan!'
          : 'Your free trial is ending. Perfect time to choose your Aluma Breath subscription plan!'
      }
    >
      <PlanSelectionSection
        selectedPlan={displaySelectedPlan}
        onSelectPlan={handlePlanSelect}
        onSubscribe={() => handleSubscribe()}
        plans={plans}
        globalFeatures={features}
        disabled={!canPurchase || isFetchingPrices}
        loading={loading || isFetchingPrices}
        ctaLabel={ctaLabel}
        onPrimaryAction={onPrimaryAction}
      />
    </BottomSheet>
  );
};

export default RenderSubscriptionBottomSheet;
