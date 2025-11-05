import {heightToDP} from 'react-native-responsive-screens';
import BottomSheet from '../../../UI/BottomSheet';
import PlanSelectionSection from '../../../UI/PlanSelectionSection';
import {RenderSubscriptionBottomSheetProps} from './types';
import {features, plans} from '../../../../utils/subscriptionsData';
import {isSmallAppleScreen} from '../../../../utils/isSmallAppleScreen';

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
  disableClose = false,
  canPurchase = true,
  loading = false,
}: Props) => (
  <BottomSheet
    onClose={() => {
      if (!disableClose && setIsSubscription) {
        setIsSubscription(false);
      }
    }}
    open={isSubscription}
    disableClose={disableClose}
    height={heightToDP(isSmallAppleScreen ? 72 : 65)}
    title={
      disableClose
        ? 'Your free trial has ended. Perfect time to choose your Aluma Breath subscription plan!'
        : 'Your free trial is ending. Perfect time to choose your Aluma Breath subscription plan!'
    }>
    <PlanSelectionSection
      selectedPlan={selectedPlan}
      onSelectPlan={setSelectedPlan}
      onSubscribe={() => handleSubscribe()}
      plans={plans}
      globalFeatures={features}
      disabled={!canPurchase}
      loading={loading}
    />
  </BottomSheet>
);

export default RenderSubscriptionBottomSheet;
