// CountDownPickerModal.tsx
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

const PRESET_MINUTES = [3, 6, 9, 12, 15] as const;
type Preset = (typeof PRESET_MINUTES)[number];

const normalizeMinutes = (value: number): Preset =>
  (PRESET_MINUTES.includes(value as Preset)
    ? (value as Preset)
    : PRESET_MINUTES[0]);

type Props = {
  visible: boolean;
  onClose: (close: boolean) => void;
  onConfirm: (minutes: number, seconds: number) => void;
  initialMinutes?: number;
};

const CountDownPickerModal: React.FC<Props> = ({
  visible,
  onClose,
  onConfirm,
  initialMinutes = PRESET_MINUTES[0],
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [selectedMinute, setSelectedMinute] = useState<Preset>(() =>
    normalizeMinutes(initialMinutes),
  );

  useEffect(() => {
    if (visible) {
      setSelectedMinute(normalizeMinutes(initialMinutes));
    }
  }, [visible, initialMinutes]);

  const handleConfirm = () => {
    onClose(false); // FIX: close modal first so overlay is removed before navigating
    setTimeout(() => {
      onConfirm(selectedMinute, 0); // FIX: delay confirm until modal animation finishes
    }, 350);
  };

  const handleBackdrop = () => onClose(false);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={handleBackdrop}
      presentationStyle="overFullScreen"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleBackdrop}>
        <View style={styles.overlay}>
          <SafeAreaView
            edges={[]}
            style={[styles.safeArea, isDark && styles.safeAreaDark]}
          >
            <TouchableWithoutFeedback>
              <View style={[styles.sheet, isDark ? styles.sheetDark : styles.sheetLight]}>
                {/* Header iOS-style */}
                <View style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}>
                  <TouchableOpacity
                    onPress={handleBackdrop}
                    hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
                  >
                    <Text style={[styles.headerAction, isDark ? styles.actionDark : styles.actionLight]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleConfirm}
                    hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
                  >
                    <Text style={[styles.headerAction, styles.headerActionPrimary, isDark ? styles.actionPrimaryDark : styles.actionPrimaryLight]}>
                      Play
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Wheel com apenas os minutos pré-definidos */}
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedMinute}
                    onValueChange={(val: Preset) => setSelectedMinute(val)}
                    style={styles.picker}
                    itemStyle={[
                      styles.pickerItemText,
                      isDark ? styles.pickerItemTextDark : styles.pickerItemTextLight,
                    ]}
                  >
                    {PRESET_MINUTES.map((m) => (
                      <Picker.Item
                        key={m}
                        value={m}
                        // rótulo como no pedido: "3 minutes", "6 minutes", ...
                        label={`${m} minutes`}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CountDownPickerModal;
