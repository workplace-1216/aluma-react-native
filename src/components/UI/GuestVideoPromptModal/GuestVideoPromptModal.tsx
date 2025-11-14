import React from 'react';
import {Modal, Pressable, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {styles} from './styles';

export interface GuestVideoPromptModalProps {
  visible: boolean;
  onClose: () => void;
  onSignUpPress?: () => void;
  onStartPress?: () => void;
  isGuest?: boolean;
}

const GuestVideoPromptModal: React.FC<GuestVideoPromptModalProps> = ({
  visible,
  onClose,
  onSignUpPress,
  onStartPress,
  isGuest = true,
}) => {
  const isMemberView = !isGuest;
  const primaryHandler = isMemberView ? onStartPress : onSignUpPress;
  const description = isMemberView ? (
    <Text style={styles.description}>
      Press Start to begin the exercise.{'\n'}
      Use the settings icon to switch practice or guide.
    </Text>
  ) : (
    <Text style={styles.description}>
      <Text style={styles.link}>Sign up to explore all of our yoga sessions.</Text>
      {'\n'}
      <Text style={styles.link}>Find out more about our practices and guides.</Text>
    </Text>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTouchable} onPress={onClose} />
        <View style={styles.sheet}>
          <LinearGradient
            colors={['#1E2746', '#113D56', '#045466']}
            style={[styles.modalView, styles.gradientContainer]}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
          />
          <View style={styles.content}>
            <Text style={styles.title}>Take a moment to settle in and breathe</Text>
            {description}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                !primaryHandler && styles.primaryButtonDisabled,
              ]}
              onPress={() => {
                primaryHandler?.();
              }}
              disabled={!primaryHandler}>
              <Text style={styles.primaryText}>
                {isMemberView ? 'Start' : 'Sign Up For Free Trial'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GuestVideoPromptModal;
