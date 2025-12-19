import React, {useEffect, useState} from 'react';
import {heightToDP} from 'react-native-responsive-screens';
import BottomSheet from '../../../UI/BottomSheet';
import PlanSelectionSection from '../../../UI/PlanSelectionSection';
import {RenderSubscriptionBottomSheetProps} from './types';
import {
  features,
  plans as defaultPlans,
} from '../../../../utils/subscriptionsData';
import {isSmallAppleScreen} from '../../../../utils/isSmallAppleScreen';
import {SubscriptionPlan, PlanCard} from '../../../../utils/types';
import {getProductsFromAppStore} from '../../../../service/billing/revenuecat';
import {PRODUCT_ID_BY_PLAN} from '../../../../constants/billing';
import {RC_ENABLED} from '../../../../utils/env';

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

  // Fetch subscription prices from RevenueCat when modal opens
  useEffect(() => {
    if (!isSubscription || !RC_ENABLED) {
      return;
    }

    const fetchPrices = async () => {
      setIsFetchingPrices(true);
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

          // Map RevenueCat products to PlanCard format
          const updatedPlans: PlanCard[] = defaultPlans.map(defaultPlan => {
            // Find matching product by identifier
            const product = products.find(
              p => p.identifier === PRODUCT_ID_BY_PLAN[defaultPlan.id],
            );

            if (product && product.priceString) {
              // Update price with real price from RevenueCat
              const priceString = product.priceString;

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

              return {
                ...defaultPlan,
                price: `${priceString}${periodSuffix}`,
                features: updatedFeatures,
              };
            }

            // Fallback to default if product not found
            return defaultPlan;
          });

          setPlans(updatedPlans);
          console.log(
            '[RenderSubscriptionBottomSheet] ✅ Updated plans with RevenueCat prices',
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

  return (
    <BottomSheet
      onClose={handleClose}
      open={isSubscription}
      disableClose={disableClose}
      showCloseButton={false}
      height={heightToDP(isSmallAppleScreen ? 75 : 70)}
      title={
        disableClose
          ? 'Your free trial has ended. Perfect time to choose your Aluma Breath subscription plan!'
          : 'Your free trial is ending. Perfect time to choose your Aluma Breath subscription plan!'
      }>
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
