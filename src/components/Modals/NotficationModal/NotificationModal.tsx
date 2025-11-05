import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
} from 'react-native';
import {styles} from './styles';
import {Picker} from '@react-native-picker/picker';

const FrequencyModal = ({
  isVisible,
  onClose,
  onConfirm,
  frequencyOptions,
  selectedFrequency,
  onSelectFrequency,
}) => {
  const [tempSelected, setTempSelected] = useState(selectedFrequency);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    if (isVisible) {
      setTempSelected(selectedFrequency);
    }
  }, [isVisible, selectedFrequency]);

  const handleConfirm = async () => {
    onSelectFrequency(tempSelected);
    await onConfirm(tempSelected);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.safeView}>
            <TouchableWithoutFeedback>
              <View style={[styles.modal, isDark && styles.modalDark]}>
                <Picker
                  selectedValue={tempSelected}
                  onValueChange={itemValue => setTempSelected(itemValue)}
                  style={styles.picker}
                  itemStyle={[
                    styles.wheelText,
                    isDark && styles.wheelTextDark,
                  ]}>
                  {frequencyOptions.map((option: string) => (
                    <Picker.Item
                      key={option}
                      label={option}
                      value={option}
                      style={[styles.wheelText, isDark && styles.wheelTextDark]}
                    />
                  ))}
                </Picker>

                <TouchableOpacity
                  style={[
                    styles.confirmButtonStyle,
                    isDark && styles.confirmButtonDark,
                  ]}
                  onPress={handleConfirm}>
                  <Text
                    style={[
                      styles.confirmText,
                      isDark && styles.confirmTextDark,
                    ]}>
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
            <TouchableOpacity
              style={[styles.buttonStyle, isDark && styles.buttonStyleDark]}
              onPress={onClose}>
              <Text
                style={[styles.cancelText, isDark && styles.cancelTextDark]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default FrequencyModal;
