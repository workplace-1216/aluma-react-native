import { SubscriptionPlan } from '../../../../utils/types';

export type RenderSubscriptionBottomSheetProps = {
  isSubscription: boolean;
  setIsSubscription: (val: boolean) => void;
  selectedPlan: SubscriptionPlan;
  setSelectedPlan: (val: SubscriptionPlan) => void;
  handleSubscribe: () => void;
};
