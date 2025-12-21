import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Text, TouchableOpacity, View, ScrollView} from 'react-native';
import BottomSheet from '../../UI/BottomSheet/BottomSheet';
import {styles} from './styles';
import {TutorResponse, VoiceGuide} from '../../../utils/types';
import {heightToDP} from 'react-native-responsive-screens';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {setSelectedTutor} from '../../../redux/slice/tutorSlice';
import {fetchTutorsOnce} from '../../../service/tutors/fetchTutorsOnce';

const isBackendNoVoice = (name?: string | null) =>
  (name ?? '').trim().toLowerCase() === 'voicefree';

const isNoVoiceTabName = (name?: string | null) =>
  (name ?? '').trim().toLowerCase() === 'no voice' || isBackendNoVoice(name);

type StartPayload = {
  guide: VoiceGuide | null;
  muteAudio: boolean;
};

type Props = {
  isVoiceSettingVisible: boolean;
  title: string;
  setIsVoiceSettingVisible: (visible: boolean) => void;
  onStartGuide: (payload: StartPayload) => void;
  onRequireSubscription?: () => void;
};

const GuidedVoiceSelectionModal = ({
  title,
  isVoiceSettingVisible,
  setIsVoiceSettingVisible,
  onStartGuide,
  onRequireSubscription,
}: Props) => {
  const dispatch = useAppDispatch();
  // All guides vindos do Redux
  const allVoiceGuides = useAppSelector(
    s => s.voiceGuide.allVoiceGuides as VoiceGuide[] | undefined,
  );
  const userSubscription = useAppSelector(s => s.user?.subscription);

  const close = useCallback(() => setIsVoiceSettingVisible(false), [setIsVoiceSettingVisible]);

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedGuideIndex, setSelectedGuideIndex] = useState<number | null>(null);

  const tutorState = useAppSelector(state => state.tutor);
  const {allTutors, status: tutorStatus, error: tutorError} = tutorState;
  const hasTutors = allTutors.length > 0;
  const showSkeletonState =
    (tutorStatus === 'idle' || tutorStatus === 'loading') && !hasTutors;
  const showErrorState = tutorStatus === 'error' && !hasTutors;
  const showEmptyState = tutorStatus === 'success' && !hasTutors;

  const voiceTabs = useMemo(() => {
    if (!hasTutors) {
      return [];
    }
    const filteredTutors = allTutors.filter(
      t => (t.name ?? '').trim().toLowerCase() !== 'voicefree',
    );
    const hasExplicitNoVoice = filteredTutors.some(t =>
      isNoVoiceTabName(t.name),
    );
    const fallbackTutor: TutorResponse = {
      _id: 'none' as any,
      name: 'No voice',
      bio: '',
      profile_picture: '',
    };
    if (!hasExplicitNoVoice) {
      return [fallbackTutor, ...filteredTutors];
    }
    return filteredTutors.length > 0 ? filteredTutors : [fallbackTutor];
  }, [allTutors, hasTutors]);

  const selectedTutorForList =
    voiceTabs[selectedTabIndex] ?? voiceTabs[0] ?? undefined;

  const filteredGuides = useMemo(() => {
    if (!allVoiceGuides || !selectedTutorForList) {
      return [];
    }

    const isNoVoice =
      selectedTutorForList._id === ('none' as any) ||
      (selectedTutorForList.name ?? '').toLowerCase() === 'no voice';

    let list = allVoiceGuides;

    if (isNoVoice) {
      list = list.filter(
        vg => (vg.tutor_id?.name ?? '').trim().toLowerCase() === 'voicefree',
      );
    } else {
      const tutorId = String(selectedTutorForList._id);
      list = list.filter(
        vg => vg.tutor_id?._id && String(vg.tutor_id._id) === tutorId,
      );
    }

    return list;
  }, [allVoiceGuides, selectedTutorForList]);

  useEffect(() => {
    if (!isVoiceSettingVisible) {
      return;
    }
    const shouldFetch =
      tutorStatus === 'idle' || (tutorStatus === 'error' && !hasTutors);
    if (shouldFetch) {
      fetchTutorsOnce(dispatch).catch(error => {
        console.log('[GuidedVoiceModal] fetch tutors failed', error);
      });
    }
  }, [dispatch, isVoiceSettingVisible, tutorStatus, hasTutors]);

  useEffect(() => {
    if (voiceTabs.length === 0) {
      setSelectedTabIndex(0);
      setSelectedGuideIndex(null);
      return;
    }
    if (selectedTabIndex >= voiceTabs.length) {
      setSelectedTabIndex(0);
      setSelectedGuideIndex(null);
    }
  }, [voiceTabs.length, selectedTabIndex]);

  const handleSelectTutorTab = useCallback((idx: number) => {
    setSelectedTabIndex(idx);
    setSelectedGuideIndex(null);
  }, []);

  const handleSelectGuide = useCallback((idx: number) => {
    setSelectedGuideIndex(prev => (prev === idx ? null : idx));
  }, []);

  const handleRetry = useCallback(() => {
    fetchTutorsOnce(dispatch, {force: true}).catch(error => {
      console.log('[GuidedVoiceModal] retry fetch failed', error);
    });
  }, [dispatch]);

  const hasActivePaidPlan = useMemo(() => {
    const plan = userSubscription?.plan ?? 'free';
    const expiryValue = userSubscription?.expiry;
    const expiryDate =
      typeof expiryValue === 'string' || typeof expiryValue === 'number'
        ? new Date(expiryValue)
        : expiryValue instanceof Date
        ? expiryValue
        : null;
    // Only treat as active if plan is not free and expiry is in the future
    return (
      plan !== 'free' &&
      expiryDate instanceof Date &&
      !Number.isNaN(expiryDate.getTime()) &&
      expiryDate > new Date()
    );
  }, [userSubscription?.plan, userSubscription?.expiry]);

  const requiresSubscription = useMemo(() => {
    const plan = userSubscription?.plan ?? 'free';
    if (plan === 'free') {
      return true;
    }

    return !hasActivePaidPlan;
  }, [hasActivePaidPlan, userSubscription?.plan]);

  const onStart = useCallback(() => {

    const isNoVoice =
      selectedTutorForList &&
      ((selectedTutorForList._id as any) === 'none' ||
        (selectedTutorForList.name ?? '').toLowerCase() === 'no voice');

    if (!isNoVoice && requiresSubscription && onRequireSubscription) {
      onRequireSubscription();
      close();
      return;
    }

    const chosen =
      filteredGuides.length > 0
        ? filteredGuides[selectedGuideIndex ?? 0]
        : undefined;

    if (selectedTutorForList && !isNoVoice) {
      dispatch(setSelectedTutor(selectedTutorForList));
    }

    onStartGuide({
      guide: chosen ?? null,
      muteAudio: Boolean(isNoVoice),
    });
    close();
  }, [
    selectedTutorForList,
    filteredGuides,
    selectedGuideIndex,
    onStartGuide,
    close,
    requiresSubscription,
    onRequireSubscription,
  ]);

  const renderSkeletonTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabRow}
      nestedScrollEnabled>
      {Array.from({length: 3}).map((_, idx) => (
        <View
          key={`skeleton-tab-${idx}`}
          style={[styles.tabChip, styles.tabChipSkeleton]}
        />
      ))}
    </ScrollView>
  );

  const renderSkeletonList = () => (
    <View style={styles.skeletonList}>
      {Array.from({length: 3}).map((_, idx) => (
        <View
          key={`skeleton-pill-${idx}`}
          style={styles.exercisePillSkeleton}
        />
      ))}
    </View>
  );

  const renderSkeletonState = () => (
    <View style={styles.skeletonState}>
      {renderSkeletonTabs()}
      {renderSkeletonList()}
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.stateContainer}>
      <Text style={styles.stateTitle}>Erro ao carregar instrutores.</Text>
      <Text style={styles.stateSubtitle}>
        {tutorError ?? 'Verifique sua conexão e tente novamente.'}
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
        <Text style={styles.retryButtonText}>Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.stateContainer}>
      <Text style={styles.stateTitle}>Nenhum instrutor disponível.</Text>
      <Text style={styles.stateSubtitle}>
        Atualize novamente para verificar novas instrutoras.
      </Text>
    </View>
  );

  const renderTutorTabs = () => {
    if (voiceTabs.length === 0) {
      return null;
    }
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabRow}
        nestedScrollEnabled>
        {voiceTabs.map((t, i) => {
          const selected = i === selectedTabIndex;
          return (
            <TouchableOpacity
              key={t._id ?? `${t.name}-${i}`}
              onPress={() => handleSelectTutorTab(i)}
              activeOpacity={0.9}
              style={[styles.tabChip, selected && styles.tabChipSelected]}>
              <Text
                style={[
                  styles.tabChipText,
                  selected && styles.tabChipTextSelected,
                ]}>
                {t.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const renderGuidesList = () => (
    <ScrollView
      style={styles.exerciseList}
      contentContainerStyle={styles.exerciseContent}
      showsVerticalScrollIndicator={false}>
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
              ]}>
              <Text
                style={[
                  styles.exerciseText,
                  selected && styles.exerciseTextSelected,
                ]}>
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
  );

  const renderMainContent = () => {
    if (showSkeletonState) {
      return renderSkeletonState();
    }
    if (showErrorState) {
      return renderErrorState();
    }
    if (showEmptyState) {
      return renderEmptyState();
    }

    return (
      <>
        {renderTutorTabs()}

        <Text style={[styles.sectionTitle, {marginTop: 25}]}>
          {selectedTutorForList &&
          ((selectedTutorForList.name || '').toLowerCase() === 'no voice')
            ? 'No voice (default)'
            : 'Available guides'}
        </Text>

        {renderGuidesList()}

        <TouchableOpacity
          style={styles.startButton}
          onPress={onStart}
          activeOpacity={0.9}>
          <Text style={styles.startText}>Start</Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <BottomSheet
      title={title || 'Voice guides'}
      open={isVoiceSettingVisible}
      onClose={close}
      height={heightToDP('70%')}
      showHeader={false}
      isScrollable
      noGutters
      draggable
    >
      <View style={styles.sheetInner}>
        <Text style={styles.sectionTitle}>{title || 'Voice guides'}</Text>
        {renderMainContent()}
      </View>
    </BottomSheet>
  );
};

export default GuidedVoiceSelectionModal;
