// src/components/subscription/PlanSelectionSection.tsx
import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import colors from '../../../assets/colors';
import { styles } from './styles';
import { webURL } from '../../../constants/constants';

type SubscriptionPlan = 'monthly' | 'yearly';

interface PlanCard {
  id: SubscriptionPlan;
  title: string;
  price: string;
  features: string[];
}

interface PlanSelectionSectionProps {
  selectedPlan: SubscriptionPlan | null;
  onSelectPlan: (planId: SubscriptionPlan) => void;
  onSubscribe: () => void;
  plans: PlanCard[];
  globalFeatures: string[];
  disabled?: boolean;
  loading?: boolean;
  ctaLabel?: string;
  onPrimaryAction?: () => void;
}

const PlanSelectionSection = ({
  selectedPlan,
  onSelectPlan,
  onSubscribe,
  plans,
  globalFeatures,
  disabled = false,
  loading = false,
  ctaLabel = 'Continue',
  onPrimaryAction,
}: PlanSelectionSectionProps) => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const splitPrice = (price: string): [string, string | null] => {
    const match = price.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    if (match) {
      return [match[1].trim(), match[2].trim()];
    }
    return [price, null];
  };

  const handlePrimaryCta = () => {
    if (disabled || loading) {
      return;
    }

    if (onPrimaryAction) {
      onPrimaryAction();
      return;
    }

    onSubscribe();
  };

  const renderPlanCard = (plan: PlanCard) => {
    const isSelected = selectedPlan === plan.id;
    const [mainPrice, secondaryPrice] = splitPrice(plan.price);

    return (
      <TouchableOpacity
        key={plan.id}
        style={[
          styles.planCard,
          isSelected ? styles.selectedCard : styles.unselectedCard,
          disabled && { opacity: 0.6 },
        ]}
        onPress={() => onSelectPlan(plan.id)}
        activeOpacity={0.8}
        disabled={disabled || loading}
      >
        <Text
          style={[
            styles.planTitle,
            isSelected ? styles.selectedText : styles.unselectedText,
          ]}
        >
          {plan.title}
        </Text>

        <Text
          style={[
            styles.planPrice,
            secondaryPrice ? styles.planPriceWithSecondary : null,
            isSelected ? styles.selectedText : styles.unselectedText,
          ]}
        >
          {mainPrice}
        </Text>
        {secondaryPrice ? (
          <Text
            style={[
              styles.planPriceSecondary,
              isSelected ? styles.selectedText : styles.unselectedText,
            ]}
          >
            ({secondaryPrice})
          </Text>
        ) : null}

        <View style={styles.featuresContainer}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Text
                style={[
                  styles.featureText,
                  isSelected
                    ? styles.selectedFeatureText
                    : styles.unselectedFeatureText,
                ]}
              >
                {feature}
              </Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <View style={styles.cardsContainer}>{plans.map(renderPlanCard)}</View>

      <View style={styles.globalFeatures}>
        {globalFeatures.map((feature, index) => (
          <View key={index} style={styles.globalFeatureRow}>
            {/* <Text
              style={[
                styles.globalFeatureText,
                {
                  fontSize: responsiveUtils.relativeFontSize(24),
                  marginRight: widthToDP(1.5),
                },
              ]}
            >
              √
            </Text> */}
            <Text style={styles.globalFeatureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.subscribeButton,
          (disabled || loading) && {opacity: 0.6},
        ]}
        onPress={handlePrimaryCta}
        disabled={disabled || loading}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.subscribeButtonText}>{ctaLabel}</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.trialNote}>
        Free for 7 days, then auto-renews monthly. Cancel anytime in your App Store settings.
      </Text>
      {/* Legal footer abaixo do Continue
      <View style={{ marginTop: 8, paddingHorizontal: 12 }}>
        <Text style={{ textAlign: 'center', opacity: 0.8, lineHeight: 20,color: 'white' }}>

          <Text
            style={{ textDecorationLine: 'underline' }}
            onPress={() => setShowTerms(true)}
          >
            Terms of Use (EULA)
          </Text>{' '}
          and{' '}
          <Text
            style={{ textDecorationLine: 'underline' }}
            onPress={() => setShowPrivacy(true)}
          >
            Privacy Policy
          </Text>
          .
        </Text>

      </View>

    
      <Modal
        visible={showPrivacy}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPrivacy(false)}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <Pressable onPress={() => setShowPrivacy(false)}>
              <Text style={{ fontWeight: '600' }}>{'‹ Back'}</Text>
            </Pressable>
          </View>
          <WebView source={{ uri: `${webURL}privacy` }} style={{ flex: 1 }} />
        </SafeAreaView>
      </Modal>

      <Modal
        visible={showTerms}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTerms(false)}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <Pressable onPress={() => setShowTerms(false)}>
              <Text style={{ fontWeight: '600' }}>{'‹ Back'}</Text>
            </Pressable>
          </View>

          <WebView source={{ uri: `${webURL}terms` }} style={{ flex: 1 }} />
        </SafeAreaView>
      </Modal> */}
    </View>
  );
};

export default PlanSelectionSection;
