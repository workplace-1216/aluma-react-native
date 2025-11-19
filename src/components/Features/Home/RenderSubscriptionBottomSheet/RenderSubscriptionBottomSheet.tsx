import React, {useEffect, useState} from 'react';
import {heightToDP} from 'react-native-responsive-screens';
import BottomSheet from '../../../UI/BottomSheet';
import PlanSelectionSection from '../../../UI/PlanSelectionSection';
import {RenderSubscriptionBottomSheetProps} from './types';
import {features, plans} from '../../../../utils/subscriptionsData';
import {isSmallAppleScreen} from '../../../../utils/isSmallAppleScreen';
import {SubscriptionPlan} from '../../../../utils/types';

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
        disabled={!canPurchase}
        loading={loading}
        ctaLabel={ctaLabel}
        onPrimaryAction={onPrimaryAction}
      />
    </BottomSheet>
  );
};

export default RenderSubscriptionBottomSheet;
