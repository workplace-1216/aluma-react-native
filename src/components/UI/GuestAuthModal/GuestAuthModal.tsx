import React, {useCallback} from 'react';
import {
  InteractionManager,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import images from '../../../assets/images';
import {styles} from './styles';

interface GuestAuthModalProps {
  visible: boolean;
  onClose: () => void;
  onSignUpPress: () => void;
  onLoginPress: () => void;
}

const GuestAuthModal: React.FC<GuestAuthModalProps> = ({
  visible,
  onClose,
  onSignUpPress,
  onLoginPress,
}) => {
  const runAfterClose = useCallback(
    (action: () => void) => {
      onClose();
      InteractionManager.runAfterInteractions(action);
    },
    [onClose],
  );

  const handleSignUpPress = useCallback(() => {
    runAfterClose(onSignUpPress);
  }, [runAfterClose, onSignUpPress]);

  const handleLoginPress = useCallback(() => {
    runAfterClose(onLoginPress);
  }, [runAfterClose, onLoginPress]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
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
            <Text style={styles.title}>Aluma Breath</Text>
            <Image source={images.Ellipse} style={styles.logo} />
            <Text style={styles.description}>
              A mindfulness space for your sleep, meditation and relaxation
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={handleSignUpPress}>
              <Text style={styles.primaryText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleLoginPress}>
              <Text style={styles.secondaryText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GuestAuthModal;
