// src/components/subscription/PlanSelectionSection.tsx
import React from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import colors from '../../../assets/colors';
import { styles } from './styles';
import responsiveUtils from '../../../utils/responsiveUtils';
import { widthToDP } from 'react-native-responsive-screens';

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
                  isSelected ? styles.selectedFeatureText : styles.unselectedFeatureText,
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
            <Text
              style={[
                styles.globalFeatureText,
                {
                  fontSize: responsiveUtils.relativeFontSize(24),
                  marginRight: widthToDP(1.5),
                },
              ]}
            >
              √
            </Text>
            <Text style={styles.globalFeatureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.subscribeButton, (disabled || loading) && { opacity: 0.6 }]}
        onPress={onSubscribe}
        disabled={disabled || loading}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.subscribeButtonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default PlanSelectionSection;
