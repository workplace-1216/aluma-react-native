import React, {useMemo, useCallback} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import BottomSheet from '../../UI/BottomSheet/BottomSheet'; // ajuste se o caminho for diferente
import {styles} from './styles';
import {heightToDP} from 'react-native-responsive-screens';
import {SleepTimes} from './types';

interface SleepTimerModalProps {
  isModalVisible: boolean;
  title?: string;
  setIsModalVisible: (visible: boolean) => void;
  options: SleepTimes[];
  selectedValue: string | null;
  onSelectValue: (value: string) => void;
  isTimerActive: boolean;
  remainingText?: string;
  primaryButtonLabel: string;
  onPrimaryAction: () => void;
}

const SleepTimerModal: React.FC<SleepTimerModalProps> = ({
  isModalVisible,
  title,
  setIsModalVisible,
  options,
  selectedValue,
  onSelectValue,
  isTimerActive,
  remainingText,
  primaryButtonLabel,
  onPrimaryAction,
}) => {
  const close = useCallback(() => setIsModalVisible(false), [setIsModalVisible]);
  const handlePrimary = useCallback(() => {
    onPrimaryAction();
    close();
  }, [onPrimaryAction, close]);

  // altura do sheet baseada na quantidade (com limites)
  const sheetHeight = useMemo(() => {
    const base = 200; // título + respiro
    const perItem = 64; // altura aproximada de cada pill
    const h = base + (options?.length ?? 0) * perItem;
    const minH = heightToDP('55%');
    const maxH = heightToDP('75%');
    return Math.max(minH, Math.min(h, maxH));
  }, [options]);

  return (
    <BottomSheet
      title={title || 'Sleep Timer'}
      open={isModalVisible}
      onClose={close}
      height={sheetHeight}
      showHeader={false}   // título customizado abaixo
      isScrollable
      noGutters
      draggable
    >
      <View style={styles.container}>
        <Text style={styles.headerTitle}>{title || 'Sleep Timer'}</Text>

        <View style={styles.list}>
          {(options ?? []).map((t, idx) => {
            const isSelected = selectedValue === t.value;
            return (
              <TouchableOpacity
                key={`${t.value}-${idx}`}
                activeOpacity={0.9}
                onPress={() => onSelectValue(t.value)}
                style={[styles.pill, isSelected && styles.pillSelected]}
              >
                <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                  {t.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {isTimerActive && remainingText ? (
          <Text style={styles.elapsedText}>{remainingText}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.95}
          onPress={handlePrimary}
        >
          <Text style={styles.startText}>
            {primaryButtonLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

export default SleepTimerModal;
