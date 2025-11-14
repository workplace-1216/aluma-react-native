import React, {useCallback, useMemo, useState} from 'react';
import {Text, TouchableOpacity, View, ScrollView} from 'react-native';
import BottomSheet from '../../UI/BottomSheet/BottomSheet';
import {styles} from './styles';
import {TutorResponse, VoiceGuide} from '../../../utils/types';
import {heightToDP} from 'react-native-responsive-screens';
import {useAppSelector} from '../../../redux/store';

type Props = {
  isVoiceSettingVisible: boolean;
  title: string;
  setIsVoiceSettingVisible: (visible: boolean) => void;
  tutors: TutorResponse[];
  /** Opcional: filtrar por exercício atual */
  currentExerciseId?: string;
  /**
   * NOVO: avisa o pai qual guia usar ao tocar Start.
   * Passe `null` para "No voice".
   */
  onStartGuide: (guide: VoiceGuide | null) => void;
};

const GuidedVoiceSelectionModal = ({
  title,
  isVoiceSettingVisible,
  setIsVoiceSettingVisible,
  tutors,
  currentExerciseId,
  onStartGuide,
}: Props) => {
  // All guides vindos do Redux
  const allVoiceGuides = useAppSelector(
    s => s.voiceGuide.allVoiceGuides as VoiceGuide[] | undefined,
  );

  // Abas (garante "No voice" à esquerda)
  const voiceTabs = useMemo(() => {
    const hasNone = tutors?.some(t => (t.name || '').toLowerCase() === 'no voice');
    const base = hasNone
      ? tutors
      : ([{_id: 'none' as any, name: 'No voice'} as TutorResponse, ...(tutors || [])]);
    return base ?? [];
  }, [tutors]);

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedGuideIndex, setSelectedGuideIndex] = useState<number | null>(null);

  const close = useCallback(() => setIsVoiceSettingVisible(false), [setIsVoiceSettingVisible]);

  const handleSelectTutorTab = useCallback((idx: number) => {
    setSelectedTabIndex(idx);
    setSelectedGuideIndex(null); // reset seleção quando muda a aba
  }, []);

  const selectedTutorForList = voiceTabs[selectedTabIndex];

  // Lista dinâmica (por tutor e opcionalmente exercício)
  const filteredGuides = useMemo(() => {
    if (!allVoiceGuides || !selectedTutorForList) {return [];}

    const isNoVoice =
      selectedTutorForList._id === ('none' as any) ||
      (selectedTutorForList.name ?? '').toLowerCase() === 'no voice';

    if (isNoVoice) {return [];}

    const tutorId = String(selectedTutorForList._id);
    let list = allVoiceGuides.filter(vg => vg.tutor_id?._id && String(vg.tutor_id._id) === tutorId);

    if (currentExerciseId) {
      list = list.filter(vg => vg.exercise_id?._id && String(vg.exercise_id._id) === String(currentExerciseId));
    }

    return list;
  }, [allVoiceGuides, selectedTutorForList, currentExerciseId]);

  const handleSelectGuide = useCallback((idx: number) => {
    setSelectedGuideIndex(prev => (prev === idx ? null : idx));
  }, []);

  /**
   * Ao tocar Start:
   *  - Se aba for "No voice" => onStartGuide(null)
   *  - Senão => pega o guia selecionado (ou o primeiro) e envia
   *  - Fecha a modal
   */
  const onStart = useCallback(() => {
    const isNoVoice =
      selectedTutorForList &&
      ((selectedTutorForList._id as any) === 'none' ||
        (selectedTutorForList.name ?? '').toLowerCase() === 'no voice');

    if (isNoVoice) {
      onStartGuide(null);
      close();
      return;
    }

    const chosen =
      filteredGuides.length > 0
        ? filteredGuides[selectedGuideIndex ?? 0]
        : undefined;

    onStartGuide(chosen ?? null);
    close();
  }, [selectedTutorForList, filteredGuides, selectedGuideIndex, onStartGuide, close]);

  return (
    <BottomSheet
      title={title || 'Voice guides'}
      open={isVoiceSettingVisible}
      onClose={close}
      height={heightToDP('63%')}
      showHeader={false}
      isScrollable
      noGutters
      draggable
    >
      <View style={styles.sheetInner}>
        <Text style={styles.sectionTitle}>{title || 'Voice guides'}</Text>

        {/* Abas (tutores) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}
          nestedScrollEnabled
        >
          {voiceTabs.map((t, i) => {
            const selected = i === selectedTabIndex;
            return (
              <TouchableOpacity
                key={t._id ?? `${t.name}-${i}`}
                onPress={() => handleSelectTutorTab(i)}
                activeOpacity={0.9}
                style={[styles.tabChip, selected && styles.tabChipSelected]}
              >
                <Text style={[styles.tabChipText, selected && styles.tabChipTextSelected]}>
                  {t.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Título da lista */}
        <Text style={[styles.sectionTitle, {marginTop: 25}]}>
          {selectedTutorForList &&
          ((selectedTutorForList.name || '').toLowerCase() === 'no voice')
            ? 'No voice (default)'
            : 'Available guides'}
        </Text>

        {/* Lista de guides */}
        <ScrollView
          style={styles.exerciseList}
          contentContainerStyle={styles.exerciseContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredGuides.length > 0 ? (
            filteredGuides.map((g, idx) => {
              const selected = selectedGuideIndex === idx;
              const label = g.exercise_id?.title || `Guide #${idx + 1}`;
              return (
                <TouchableOpacity
                  key={g._id ?? `guide-${idx}`}
                  activeOpacity={0.9}
                  onPress={() => handleSelectGuide(idx)}
                  style={[
                    styles.exercisePill,
                    selected && styles.exercisePillSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.exerciseText,
                      selected && styles.exerciseTextSelected,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={[styles.exerciseText, {textAlign: 'center', opacity: 0.7}]}>
              {selectedTutorForList &&
              ((selectedTutorForList.name || '').toLowerCase() === 'no voice')
                ? 'No voice selected.'
                : 'No guides for this tutor.'}
            </Text>
          )}
        </ScrollView>

        <TouchableOpacity style={styles.startButton} onPress={onStart} activeOpacity={0.9}>
          <Text style={styles.startText}>Start</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

export default GuidedVoiceSelectionModal;
