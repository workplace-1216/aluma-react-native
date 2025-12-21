import React from 'react';
import { View, Text, Modal, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { styles } from './styles';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

const BottomModal: React.FC<ModalProps> = ({ visible, onClose, title, children }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {title && <Text style={styles.title}>{title}</Text>}
              <View style={styles.content}>{children}</View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default BottomModal;
