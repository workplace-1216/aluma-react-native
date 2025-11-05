import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  useColorScheme,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './styles';
import {Picker} from '@react-native-picker/picker';

const range = (max: number) => Array.from({length: max}, (_, i) => i);

const CountDownPickerModal = ({
  visible,
  onClose,
  onConfirm,
  initialMinutes = 0,
  initialSeconds = 0,
}: {
  visible: boolean;
  onClose: (close: boolean) => void;
  onConfirm: (minutes: number, seconds: number) => void;
  initialMinutes?: number;
  initialSeconds?: number;
}) => {
  const [selectedMinute, setSelectedMinute] = useState(initialMinutes);
  const [selectedSecond, setSelectedSecond] = useState(initialSeconds);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    if (visible) {
      setSelectedMinute(initialMinutes);
      setSelectedSecond(initialSeconds);
    }
  }, [visible, initialMinutes, initialSeconds]);

  const handleConfirm = (minutes: number, seconds: number) => {
    onConfirm(minutes, seconds);
    handleClose();
  };

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <SafeAreaView edges={['top', 'bottom']} style={styles.safeView}>
            <TouchableWithoutFeedback>
              <View style={[styles.modal, isDark && styles.modalDark]}>
                <View style={styles.pickerContainer}>
                  <View style={styles.wheel}>
                    <Picker
                      selectedValue={selectedMinute}
                      onValueChange={itemValue => setSelectedMinute(itemValue)}
                      style={styles.picker}
                      itemStyle={[
                        styles.wheelText,
                        isDark && styles.wheelTextDark,
                      ]}>
                      {range(60).map((minute: number) => (
                        <Picker.Item
                          key={minute}
                          label={minute.toString().padStart(2, '0')}
                          value={minute}
                        />
                      ))}
                    </Picker>
                  </View>
                  <View style={styles.wheel}>
                    <Picker
                      selectedValue={selectedSecond}
                      onValueChange={itemValue => setSelectedSecond(itemValue)}
                      style={styles.picker}
                      itemStyle={[
                        styles.wheelText,
                        isDark && styles.wheelTextDark,
                      ]}>
                      {range(60).map((second: number) => (
                        <Picker.Item
                          key={second}
                          label={second.toString().padStart(2, '0')}
                          value={second}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.confirmButtonStyle,
                    isDark && styles.confirmButtonDark,
                  ]}
                  onPress={() => handleConfirm(selectedMinute, selectedSecond)}>
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
              onPress={handleClose}>
              <Text
                style={[styles.cancelText, isDark && styles.cancelTextDark]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CountDownPickerModal;
