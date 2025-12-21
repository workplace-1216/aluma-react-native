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
                <View style={styles.header}>
                  <TouchableOpacity onPress={onClose}>
                    <Text
                      style={[
                        styles.headerButtonText,
                        isDark
                          ? styles.headerButtonTextDark
                          : styles.headerButtonTextLight,
                      ]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleConfirm}>
                    <Text
                      style={[
                        styles.headerButtonText,
                        isDark
                          ? styles.headerButtonPrimaryDark
                          : styles.headerButtonPrimary,
                      ]}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.optionsWrapper}>
                  {frequencyOptions.map((option: string, index: number) => {
                    const isSelected = option === tempSelected;
                    return (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionRow,
                          index !== frequencyOptions.length - 1 &&
                            styles.optionRowSpacing,
                          isSelected &&
                            (isDark
                              ? styles.optionRowSelectedDark
                              : styles.optionRowSelectedLight),
                        ]}
                        activeOpacity={0.8}
                        onPress={() => setTempSelected(option)}>
                        <Text
                          style={[
                            styles.optionText,
                            isDark
                              ? styles.optionTextDark
                              : styles.optionTextLight,
                            isSelected &&
                              (isDark
                                ? styles.optionTextSelectedDark
                                : styles.optionTextSelectedLight),
                          ]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default FrequencyModal;
