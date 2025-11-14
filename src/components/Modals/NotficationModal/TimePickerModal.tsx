import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {styles} from './styles';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (hour: number, minute: number) => void | Promise<void>;
  selectedHour: number;
  selectedMinute: number;
};

const HOURS = Array.from({length: 24}, (_, idx) => idx);
const MINUTES = Array.from({length: 60}, (_, idx) => idx);

const TimePickerModal: React.FC<Props> = ({
  isVisible,
  onClose,
  onConfirm,
  selectedHour,
  selectedMinute,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [tempHour, setTempHour] = useState<number>(selectedHour);
  const [tempMinute, setTempMinute] = useState<number>(selectedMinute);

  useEffect(() => {
    if (isVisible) {
      setTempHour(selectedHour);
      setTempMinute(selectedMinute);
    }
  }, [isVisible, selectedHour, selectedMinute]);

  const handleConfirm = async () => {
    await onConfirm(tempHour, tempMinute);
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

                <View style={styles.timePickerBody}>
                  <View style={styles.timePickerColumn}>
                    <Picker
                      selectedValue={tempHour}
                      onValueChange={(value: number) => setTempHour(value)}
                      style={styles.timePicker}
                      itemStyle={[
                        styles.timePickerItem,
                        isDark
                          ? styles.timePickerItemDark
                          : styles.timePickerItemLight,
                      ]}>
                      {HOURS.map(hour => {
                        const label = hour < 10 ? `0${hour}` : `${hour}`;
                        return <Picker.Item key={hour} label={label} value={hour} />;
                      })}
                    </Picker>
                  </View>

                  <View style={styles.timePickerColumn}>
                    <Picker
                      selectedValue={tempMinute}
                      onValueChange={(value: number) => setTempMinute(value)}
                      style={styles.timePicker}
                      itemStyle={[
                        styles.timePickerItem,
                        isDark
                          ? styles.timePickerItemDark
                          : styles.timePickerItemLight,
                      ]}>
                      {MINUTES.map(minute => {
                        const label = minute < 10 ? `0${minute}` : `${minute}`;
                        return <Picker.Item key={minute} label={label} value={minute} />;
                      })}
                    </Picker>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default TimePickerModal;
