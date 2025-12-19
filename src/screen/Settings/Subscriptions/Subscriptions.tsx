import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Linking,
  ScrollView,
} from 'react-native';
import React, {useMemo, useState, useEffect} from 'react';
import Container from '../../../components/layout/Container';
import {styles} from './styles';
import {goBack, navigate} from '../../../navigation/AppNavigator';
import {
  features,
  plans as defaultPlans,
} from '../../../utils/subscriptionsData';
import {styles as planStyles} from '../../../components/UI/PlanSelectionSection/styles';
import {SubscriptionPlan, PlanCard} from '../../../utils/types';
import {HeaderWithBack} from '../../../components/UI/HeaderWithBack';
import {useAppSelector, useAppDispatch} from '../../../redux/store';
import colors from '../../../assets/colors';
import {
  purchasePlan,
  restorePurchases,
  getCustomerInfoSafe,
  isPremium,
  getProductsFromAppStore,
} from '../../../service/billing/revenuecat';
import {setFromRC} from '../../../redux/slice/subscriptionSlice';
import {setUser} from '../../../redux/slice/userSlice';
import {updateUser} from '../../../service/auth/updateUser';
import showToast from '../../../components/UI/CustomToast/CustomToast';
import routes from '../../../constants/routes';
import {RC_ENABLED} from '../../../utils/env';
import {ENTITLEMENT_ID, PRODUCT_ID_BY_PLAN} from '../../../constants/billing';

const Subscriptions = () => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState<PlanCard[]>(defaultPlans);
  const [isFetchingPrices, setIsFetchingPrices] = useState(false);
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  // Fetch subscription prices from RevenueCat when component mounts
  useEffect(() => {
    if (!RC_ENABLED) {
      return;
    }

    const fetchPrices = async () => {
      setIsFetchingPrices(true);
      try {
        console.log('[Subscriptions] Fetching prices from RevenueCat...');
        const products = await getProductsFromAppStore();

        if (products && products.length > 0) {
          console.log('[Subscriptions] ✅ Fetched products:', products);

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
            '[Subscriptions] ✅ Updated plans with RevenueCat prices',
          );
        } else {
          console.warn(
            '[Subscriptions] ⚠️ No products fetched, using default prices',
          );
          setPlans(defaultPlans);
        }
      } catch (error) {
        console.error('[Subscriptions] ❌ Error fetching prices:', error);
        // Fallback to default plans on error
        setPlans(defaultPlans);
      } finally {
        setIsFetchingPrices(false);
      }
    };

    fetchPrices();
  }, []);

  const normalizedCurrentPlan: SubscriptionPlan | 'free' = useMemo(() => {
    const plan = user?.subscription?.plan;
    if (!plan || plan === 'free') {
      return 'free';
    }

    if (plan === 'annual') {
      return 'yearly';
    }

    return 'monthly';
  }, [user?.subscription?.plan]);

  const expiryISO = user?.subscription?.expiry;
  const expiryDate = expiryISO ? new Date(expiryISO) : null;
  const now = new Date();
  const hasValidExpiry = !!expiryDate && !Number.isNaN(expiryDate.getTime());
  const isPremiumActive =
    user?.subscription?.plan !== 'free' && hasValidExpiry && expiryDate! > now;
  const isTrialActive =
    user?.subscription?.plan === 'free' && hasValidExpiry && expiryDate! > now;
  const formattedExpiry = hasValidExpiry
    ? new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(expiryDate!)
    : undefined;

  const handlePlanSelect = (planId: SubscriptionPlan) => {
    setSelectedPlan(planId);
  };

  const getButtonText = () => {
    const currentPlan = user?.subscription?.plan;
    const isPremium =
      user?.subscription?.plan !== 'free' &&
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
    } else if (
      currentPlan === selectedPlan ||
      (currentPlan === 'annual' && selectedPlan === 'yearly') ||
      (currentPlan === 'monthly' && selectedPlan === 'monthly')
    ) {
      return 'Manage Subscription';
    }

    return 'Continue';
  };

  const handleContinue = async () => {
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);

      if (!RC_ENABLED) {
        showToast(
          'Billing is currently disabled. Please try again later.',
          'error',
        );
        setIsLoading(false);
        return;
      }

      const plan: 'monthly' | 'yearly' = selectedPlan;
      showToast(`Processing ${plan} subscription...`, 'info');

      const {customerInfo} = await purchasePlan(plan);
      const info = customerInfo || (await getCustomerInfoSafe());

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

        dispatch(
          setFromRC({isPremium: true, plan, expiry: expiryISO ?? undefined}),
        );

        // Update user subscription if user is registered (optional)
        if (user?._id) {
          const updatedSubscription: {
            plan: 'monthly' | 'free' | 'annual';
            expiry: string;
          } = {
            plan: normalizedPlan,
            expiry:
              expiryISO ??
              user.subscription?.expiry ??
              new Date().toISOString(),
          };

          dispatch(
            setUser({
              ...user,
              subscription: updatedSubscription,
            }),
          );

          try {
            await updateUser(user._id, {subscription: updatedSubscription});
          } catch (updateErr) {
            console.warn(
              '[Subscriptions] Failed to persist subscription update',
              updateErr,
            );
          }
        } else {
          // User purchased without registration - show optional registration message
          showToast(
            'Subscription activated! 🎉 Register to access on all your devices.',
            'success',
          );
          goBack();
          return;
        }

        showToast('Subscription activated! 🎉', 'success');
        goBack();
      } else {
        showToast(
          'Purchase did not confirm premium. Try restoring purchases.',
          'info',
        );
      }
    } catch (e: any) {
      const errorMessage =
        e?.message || e?.userInfo?.NSLocalizedDescription || 'Please try again';

      // Check if this is a user cancellation (case-insensitive, various forms)
      const isCancellation =
        errorMessage.toLowerCase().includes('cancel') ||
        errorMessage.toLowerCase().includes('cancelled') ||
        errorMessage.toLowerCase().includes('cancellation') ||
        e?.code === 'PURCHASE_CANCELLED' ||
        e?.userCancelled === true;

      if (isCancellation) {
        // User cancelled - this is expected behavior, just log as info
        console.log('[Subscriptions] Purchase was cancelled by user');
      } else {
        // Actual error - log and show to user
        console.error('[Subscriptions] Purchase error:', e);
        showToast(`Purchase error: ${errorMessage}`, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestorePurchases = async () => {
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      showToast('Restoring purchases...', 'info');

      if (!RC_ENABLED) {
        showToast(
          'Billing is currently disabled. Please try again later.',
          'error',
        );
        setIsLoading(false);
        return;
      }

      const {customerInfo} = await restorePurchases();
      const info = customerInfo || (await getCustomerInfoSafe());

      const premium = isPremium(info);
      if (premium) {
        const entitlement = info?.entitlements.active[ENTITLEMENT_ID];
        const expiryISO = entitlement?.expirationDate ?? null;
        const plan =
          entitlement?.productIdentifier?.includes('yearly') ||
          entitlement?.productIdentifier?.includes('annual')
            ? 'yearly'
            : 'monthly';
        const normalizedPlan = plan === 'yearly' ? 'annual' : 'monthly';

        dispatch(
          setFromRC({
            isPremium: true,
            plan,
            expiry: expiryISO ?? undefined,
          }),
        );

        // Update user subscription if user is registered (optional)
        if (user?._id) {
          const updatedSubscription: {
            plan: 'monthly' | 'free' | 'annual';
            expiry: string;
          } = {
            plan: normalizedPlan,
            expiry:
              expiryISO ??
              user.subscription?.expiry ??
              new Date().toISOString(),
          };

          dispatch(
            setUser({
              ...user,
              subscription: updatedSubscription,
            }),
          );

          try {
            await updateUser(user._id, {subscription: updatedSubscription});
          } catch (updateErr) {
            console.warn(
              '[Subscriptions] Failed to persist subscription update',
              updateErr,
            );
          }
        } else {
          // User restored without registration - show optional registration message
          showToast(
            'Purchases restored! 🎉 Register to access on all your devices.',
            'success',
          );
          goBack();
          return;
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

  const handleManageStore = () => {
    const url =
      Platform.OS === 'ios'
        ? 'https://apps.apple.com/account/subscriptions'
        : 'https://play.google.com/store/account/subscriptions';
    Linking.openURL(url).catch(() => {
      showToast('Unable to open the store subscriptions page.', 'error');
    });
  };

  const statusLabel = isTrialActive
    ? 'Free trial active'
    : isPremiumActive
    ? 'Subscription active'
    : 'No subscription';
  const statusSubtext = isTrialActive
    ? `Your trial ends on ${formattedExpiry || 'the end of the period'}.`
    : isPremiumActive
    ? `Renews on ${formattedExpiry ?? 'the next billing date.'}`
    : 'Subscribe to unlock the full Aluma Breath experience.';

  return (
    <Container>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <HeaderWithBack title={'Subscriptions'} onBack={goBack} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.statusCard}>
              <Text style={styles.statusLabel}>{statusLabel}</Text>
              <Text style={styles.statusDescription}>{statusSubtext}</Text>
              <View style={styles.statusMetaRow}>
                <Text style={styles.statusMetaLabel}>Current plan</Text>
                <Text style={styles.statusMetaValue}>
                  {normalizedCurrentPlan === 'free'
                    ? 'Free'
                    : normalizedCurrentPlan === 'yearly'
                    ? 'Yearly'
                    : 'Monthly'}
                </Text>
              </View>
              <View style={styles.statusMetaRow}>
                <Text style={styles.statusMetaLabel}>
                  {isTrialActive ? 'Trial ends' : 'Renews / expires'}
                </Text>
                <Text style={styles.statusMetaValue}>
                  {formattedExpiry ?? '—'}
                </Text>
              </View>
              <Text style={styles.statusHint}>
                Cancel or re-activate anytime from your app store account.
              </Text>
              <TouchableOpacity
                style={styles.manageButton}
                onPress={handleManageStore}
                disabled={isLoading || isFetchingPrices}>
                <Text style={styles.manageButtonText}>
                  Open Store Subscription Settings
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.textWrapper}>
              <Text style={styles.titleText}>
                Choose the plan that fits your practice
              </Text>
              {!user?._id && (
                <Text
                  style={[
                    styles.titleText,
                    {
                      fontSize: 14,
                      marginTop: 8,
                      opacity: 0.8,
                      fontWeight: '400',
                    },
                  ]}>
                  You can purchase without registering. Registration is optional
                  and enables access to your subscription on all your devices.
                </Text>
              )}
            </View>

            <View style={planStyles.cardsContainer}>
              {plans.map(plan => {
                const isSelected = selectedPlan === plan.id;
                const isCurrent = normalizedCurrentPlan === plan.id;

                return (
                  <TouchableOpacity
                    key={plan.id}
                    style={[
                      planStyles.planCard,
                      isSelected
                        ? planStyles.selectedCard
                        : planStyles.unselectedCard,
                      (isLoading || isFetchingPrices) &&
                        styles.planCardDisabled,
                    ]}
                    activeOpacity={0.9}
                    onPress={() => handlePlanSelect(plan.id)}
                    disabled={isLoading || isFetchingPrices}>
                    <Text
                      style={[
                        planStyles.planTitle,
                        isSelected
                          ? planStyles.selectedText
                          : planStyles.unselectedText,
                      ]}>
                      {plan.title}
                    </Text>
                    <Text
                      style={[
                        planStyles.planPrice,
                        isSelected
                          ? planStyles.selectedText
                          : planStyles.unselectedText,
                      ]}>
                      {isFetchingPrices ? 'Loading...' : plan.price}
                    </Text>
                    <View style={planStyles.featuresContainer}>
                      {plan.features.map(feature => (
                        <View
                          key={`${plan.id}-${feature}`}
                          style={planStyles.featureRow}>
                          <View
                            style={[
                              planStyles.bullet,
                              {
                                backgroundColor: isSelected
                                  ? colors.BLACK_10
                                  : colors.WHITE,
                              },
                            ]}
                          />
                          <Text
                            style={[
                              planStyles.featureText,
                              isSelected
                                ? planStyles.selectedFeatureText
                                : planStyles.unselectedFeatureText,
                            ]}>
                            {feature}
                          </Text>
                        </View>
                      ))}
                    </View>
                    {isCurrent ? (
                      <Text style={styles.currentPlanNote}>Current plan</Text>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={planStyles.globalFeatures}>
              {features.map(feature => (
                <Text key={feature} style={planStyles.globalFeatureText}>
                  {feature}
                </Text>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  (isLoading || isFetchingPrices) &&
                    styles.continueButtonDisabled,
                ]}
                onPress={handleContinue}
                disabled={isLoading || isFetchingPrices}>
                {isLoading || isFetchingPrices ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.continueButtonText}>
                    {getButtonText()}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.restoreButton}
                onPress={handleRestorePurchases}
                disabled={isLoading || isFetchingPrices}>
                <Text style={styles.restoreButtonText}>Restore Purchases</Text>
              </TouchableOpacity>

              <View style={styles.legalTextContainer}>
                <Text style={styles.legalText}>
                  By continuing, you agree to our{' '}
                  <Text style={styles.legalLink} onPress={handleTermsPress}>
                    Terms of Use (EULA)
                  </Text>{' '}
                  and{' '}
                  <Text style={styles.legalLink} onPress={handlePrivacyPress}>
                    Privacy Policy
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default Subscriptions;
