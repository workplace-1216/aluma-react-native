import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Container from '../../../components/layout/Container';
import {SvgBack} from '../../../assets/svg';
import {styles} from './styles';
import {goBack} from '../../../navigation/AppNavigator';
import images from '../../../assets/images';
import PlanSelectionSection from '../../../components/UI/PlanSelectionSection';
import {features, plans} from '../../../utils/subscriptionsData';
import {SubscriptionPlan} from '../../../utils/types';
import {HeaderWithBack} from '../../../components/UI/HeaderWithBack';

const Subscriptions = () => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('monthly');

  const handlePlanSelect = (planId: SubscriptionPlan) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = () => {
    console.log('Subscribed to:', selectedPlan);
    // You can add your subscription API call here in the future
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
            onSubscribe={handleSubscribe}
            plans={plans}
            globalFeatures={features}
          />
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default Subscriptions;
