import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import Container from '../../../components/layout/Container';
import {styles} from './styles';
import {goBack, navigate} from '../../../navigation/AppNavigator';
import images from '../../../assets/images';
import PlanSelectionSection from '../../../components/UI/PlanSelectionSection';
import {features, plans} from '../../../utils/subscriptionsData';
import {SubscriptionPlan} from '../../../utils/types';
import {HeaderWithBack} from '../../../components/UI/HeaderWithBack';
import {useAppSelector, useAppDispatch} from '../../../redux/store';
import {
  purchasePlan,
  restorePurchases,
  getCustomerInfoSafe,
  isPremium,
} from '../../../service/billing/revenuecat';
import {setFromRC} from '../../../redux/slice/subscriptionSlice';
import {setUser} from '../../../redux/slice/userSlice';
import {updateUser} from '../../../service/auth/updateUser';
import showToast from '../../../components/UI/CustomToast/CustomToast';
import routes from '../../../constants/routes';
import {RC_ENABLED} from '../../../utils/env';
import {ENTITLEMENT_ID} from '../../../constants/billing';

const Subscriptions = () => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const handlePlanSelect = (planId: SubscriptionPlan) => {
    setSelectedPlan(planId);
  };

  const getButtonText = () => {
    const currentPlan = user?.subscription?.plan;
    const isPremium = user?.subscription?.plan !== 'free' && 
                     user?.subscription?.expiry && 
                     new Date(user.subscription.expiry) > new Date();

    if (!isPremium) {
      return 'Continue';
    }

    // User has an active subscription
    if (currentPlan === 'monthly' && selectedPlan === 'yearly') {
      return 'Upgrade to Yearly';
    } else if (currentPlan === 'annual' && selectedPlan === 'monthly') {
      return 'Downgrade to Monthly';
    } else if (currentPlan === selectedPlan || 
               (currentPlan === 'annual' && selectedPlan === 'yearly') ||
               (currentPlan === 'monthly' && selectedPlan === 'monthly')) {
      return 'Manage Subscription';
    }

    return 'Continue';
  };

  const handleContinue = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      if (!RC_ENABLED) {
        showToast('Billing is currently disabled. Please try again later.', 'error');
        setIsLoading(false);
        return;
      }

      const plan: 'monthly' | 'yearly' = selectedPlan;
      showToast(`Processing ${plan} subscription...`, 'info');

      const {customerInfo} = await purchasePlan(plan);
      const info = customerInfo || await getCustomerInfoSafe();

      const premium = isPremium(info);
      if (premium) {
        const entitlement = info?.entitlements.active[ENTITLEMENT_ID];
        const normalizedPlan: 'monthly' | 'annual' =
          plan === 'yearly' ? 'annual' : 'monthly';

        let expiryISO = entitlement?.expirationDate ?? null;
        if (!expiryISO) {
          const computedExpiry = new Date();
          if (normalizedPlan === 'annual') {
            computedExpiry.setFullYear(computedExpiry.getFullYear() + 1);
          } else {
            computedExpiry.setMonth(computedExpiry.getMonth() + 1);
          }
          expiryISO = computedExpiry.toISOString();
        }

        dispatch(setFromRC({isPremium: true, plan, expiry: expiryISO ?? undefined}));

        if (user?._id) {
          const updatedSubscription: {plan: 'monthly' | 'free' | 'annual'; expiry: string} = {
            plan: normalizedPlan,
            expiry: expiryISO ?? user.subscription?.expiry ?? new Date().toISOString(),
          };

          dispatch(
            setUser({
              ...user,
              subscription: updatedSubscription,
            })
          );

          try {
            await updateUser(user._id, {subscription: updatedSubscription});
          } catch (updateErr) {
            console.warn('[Subscriptions] Failed to persist subscription update', updateErr);
          }
        }

        showToast('Subscription activated! 🎉', 'success');
        goBack();
      } else {
        showToast('Purchase did not confirm premium. Try restoring purchases.', 'info');
      }
    } catch (e: any) {
      console.error('[Subscriptions] Purchase error:', e);
      const errorMessage = e?.message || e?.userInfo?.NSLocalizedDescription || 'Please try again';
      
      // Don't show error for user cancellation
      if (!errorMessage.includes('cancel') && !errorMessage.includes('Cancel')) {
        showToast(`Purchase error: ${errorMessage}`, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestorePurchases = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      showToast('Restoring purchases...', 'info');

      if (!RC_ENABLED) {
        showToast('Billing is currently disabled. Please try again later.', 'error');
        setIsLoading(false);
        return;
      }

      const {customerInfo} = await restorePurchases();
      const info = customerInfo || await getCustomerInfoSafe();

      const premium = isPremium(info);
      if (premium) {
        const entitlement = info?.entitlements.active[ENTITLEMENT_ID];
        const expiryISO = entitlement?.expirationDate ?? null;
        const plan = entitlement?.productIdentifier?.includes('yearly') || 
                    entitlement?.productIdentifier?.includes('annual') 
                    ? 'yearly' : 'monthly';
        const normalizedPlan = plan === 'yearly' ? 'annual' : 'monthly';

        dispatch(setFromRC({
          isPremium: true,
          plan,
          expiry: expiryISO ?? undefined,
        }));

        if (user?._id) {
          const updatedSubscription: {plan: 'monthly' | 'free' | 'annual'; expiry: string} = {
            plan: normalizedPlan,
            expiry: expiryISO ?? user.subscription?.expiry ?? new Date().toISOString(),
          };

          dispatch(
            setUser({
              ...user,
              subscription: updatedSubscription,
            })
          );

          try {
            await updateUser(user._id, {subscription: updatedSubscription});
          } catch (updateErr) {
            console.warn('[Subscriptions] Failed to persist subscription update', updateErr);
          }
        }

        showToast('Purchases restored successfully! 🎉', 'success');
        goBack();
      } else {
        showToast('No active purchases found to restore.', 'info');
      }
    } catch (e: any) {
      console.error('[Subscriptions] Restore error:', e);
      showToast(`Restore error: ${e?.message || 'Please try again'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTermsPress = () => {
    navigate(routes.TERMS_CONDITION);
  };

  const handlePrivacyPress = () => {
    navigate(routes.PRIVACY_SECURITY);
  };

  return (
    <Container>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <HeaderWithBack title={'Subscriptions'} onBack={goBack} />

        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image source={images.Logo} style={styles.logo} />
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.titleText}>
              Select your Aluma Breath subscription plan
            </Text>
          </View>

          <PlanSelectionSection
            selectedPlan={selectedPlan}
            onSelectPlan={handlePlanSelect}
            onSubscribe={handleContinue}
            plans={plans}
            globalFeatures={features}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.continueButton, isLoading && styles.continueButtonDisabled]}
              onPress={handleContinue}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.continueButtonText}>{getButtonText()}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleRestorePurchases}
              disabled={isLoading}>
              <Text style={styles.restoreButtonText}>Restore Purchases</Text>
            </TouchableOpacity>

            <View style={styles.legalTextContainer}>
              <Text style={styles.legalText}>
                By continuing, you agree to our{' '}
                <Text style={styles.legalLink} onPress={handleTermsPress}>
                  Terms of Use (EULA)
                </Text>
                {' '}and{' '}
                <Text style={styles.legalLink} onPress={handlePrivacyPress}>
                  Privacy Policy
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default Subscriptions;
