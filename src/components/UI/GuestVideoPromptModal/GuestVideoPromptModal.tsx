import React from 'react';
import {Animated, Modal, Pressable, Text, TouchableOpacity, View} from 'react-native';
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

  const [isMounted, setIsMounted] = React.useState(visible);
  const backdropAnim = React.useRef(new Animated.Value(visible ? 1 : 0)).current;
  const sheetAnim = React.useRef(new Animated.Value(visible ? 1 : 0)).current;

  const animate = React.useCallback(
    (toValue: 0 | 1, onEnd?: () => void) => {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(sheetAnim, {
          toValue,
          duration: 320,
          useNativeDriver: true,
        }),
      ]).start(({finished}) => {
        if (finished && onEnd) {onEnd();}
      });
    },
    [backdropAnim, sheetAnim],
  );

  React.useEffect(() => {
    if (visible) {
      setIsMounted(true);
      animate(1);
    } else {
      animate(0, () => setIsMounted(false));
    }
  }, [animate, visible]);

  if (!isMounted) {return null;}

  const sheetTranslate = sheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0], // desliza o conteúdo colorido sem mover o backdrop
  });

  return (
    <Modal
      visible={isMounted}
      transparent
      animationType="none"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}>
      <Animated.View style={[styles.backdrop, {opacity: backdropAnim}]}>
        <Pressable style={styles.backdropTouchable} onPress={onClose} />
        <Animated.View style={[styles.sheet, {transform: [{translateY: sheetTranslate}]}]}>
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
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default GuestVideoPromptModal;
