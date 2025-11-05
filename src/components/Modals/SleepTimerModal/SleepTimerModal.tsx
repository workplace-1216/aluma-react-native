import React, {useMemo, useCallback, useState, useEffect} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import BottomSheet from '../../UI/BottomSheet/BottomSheet'; // ajuste se o caminho for diferente
import {styles} from './styles';

interface SleepTimes {
  title: string;
  value: string;
}

interface SleepTimerModalProps {
  isModalVisible: boolean;
  title: string;
  setIsModalVisible: (visible: boolean) => void;
  handleSelection: (value: string) => void;
  sleepTimes: SleepTimes[];
}

const SleepTimerModal: React.FC<SleepTimerModalProps> = ({
  isModalVisible,
  title,
  setIsModalVisible,
  handleSelection,
  sleepTimes,
}) => {
  const close = useCallback(() => setIsModalVisible(false), [setIsModalVisible]);

  // seleciona o 1º item por padrão quando abrir
  const initialValue = useMemo(
    () => (sleepTimes && sleepTimes[0] ? sleepTimes[0].value : null),
    [sleepTimes],
  );
  const [selected, setSelected] = useState<string | null>(initialValue);

  useEffect(() => {
    if (isModalVisible) {setSelected(initialValue);}
  }, [isModalVisible, initialValue]);

  // altura do sheet baseada na quantidade (com limites)
  const sheetHeight = useMemo(() => {
    const base = 200; // título + respiro
    const perItem = 64; // altura aproximada de cada pill
    const h = base + (sleepTimes?.length ?? 0) * perItem;
    return Math.max(320, Math.min(h, 560));
  }, [sleepTimes]);

  const onStart = useCallback(() => {
    const toApply = selected ?? initialValue;
    if (toApply) {handleSelection(toApply);}
    close();
  }, [selected, initialValue, handleSelection, close]);

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
          {(sleepTimes ?? []).map((t, idx) => {
            const isSelected = selected === t.value;
            return (
              <TouchableOpacity
                key={`${t.value}-${idx}`}
                activeOpacity={0.9}
                onPress={() => setSelected(t.value)}
                style={[styles.pill, isSelected && styles.pillSelected]}
              >
                <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                  {t.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.startButton} activeOpacity={0.95} onPress={onStart}>
          <Text style={styles.startText}>Start</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

export default SleepTimerModal;
