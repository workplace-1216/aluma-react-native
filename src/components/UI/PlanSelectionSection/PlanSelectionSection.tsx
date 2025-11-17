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
  selectedPlan: SubscriptionPlan;
  onSelectPlan: (planId: SubscriptionPlan) => void;
  onSubscribe: () => void;
  plans: PlanCard[];
  globalFeatures: string[];
  disabled?: boolean;
  loading?: boolean;
}

const PlanSelectionSection = ({
  selectedPlan,
  onSelectPlan,
  onSubscribe,
  plans,
  globalFeatures,
  disabled = false,
  loading = false,
}: PlanSelectionSectionProps) => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handlePrimaryCta = () => {
    if (disabled || loading) {
      return;
    }

    onSubscribe();
  };

  const renderPlanCard = (plan: PlanCard) => {
    const isSelected = selectedPlan === plan.id;

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
            isSelected ? styles.selectedText : styles.unselectedText,
          ]}
        >
          {plan.price}
        </Text>

        <View style={styles.featuresContainer}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <View
                style={[
                  styles.bullet,
                  {
                    backgroundColor: isSelected ? colors.BLACK_10 : colors.WHITE,
                  },
                ]}
              />
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
        style={[styles.subscribeButton, (disabled || loading) && { opacity: 0.6 }]}
        onPress={handlePrimaryCta}
        disabled={disabled || loading}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.subscribeButtonText}>Continue</Text>
        )}
      </TouchableOpacity>
      {/* Legal footer abaixo do Continue */}
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

      {/* Modais legais (WebView) */}
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
          {/* Se preferir usar o EULA padrão da Apple, troque a URL abaixo por:
             'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/' */}
          <WebView source={{ uri: `${webURL}terms` }} style={{ flex: 1 }} />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default PlanSelectionSection;
