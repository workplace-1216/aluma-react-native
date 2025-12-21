import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {ActivityIndicator, FlatList, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgHeadphones, SvgPlus } from '../../../assets/svg';
import { goBack, navigate, reset } from '../../../navigation/AppNavigator';
import SegmentControl from '../../../components/UI/SegmentControl';
import MoodCard from '../../../components/UI/MoodCard';
// ⚠️ Ajuste o caminho se necessário (no seu snippet estava .../getMoodsAlll)
import { getMoodsAll } from '../../../service/mood/getMoodsAlll';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { FREQUENCY, setMoods } from '../../../redux/slice/moodSlice';
import {
  addToFrequencyQueue,
  clearFrequencyQueue,
  resetCurrentIndex,
  startAllInOneSession,
} from '../../../redux/slice/frequencyQueueSlice';
import FrequencyCard from '../../../components/UI/FrequencyCard';
import routes from '../../../constants/routes';
import Loader from '../../../components/UI/Loader';
import { getSavedFrequencies } from '../../../service/frequency/UserFrequencies/getSavedFrequencies';
import { removeFrequency } from '../../../service/frequency/UserFrequencies/removeFrequency';
import { useNavigation } from '@react-navigation/native';
import showToast from '../../../components/UI/CustomToast/CustomToast';
import Container from '../../../components/layout/Container';
import CountDownPickerModal from '../../../components/Modals/CountDownPickerModal';
import { HeaderWithBack } from '../../../components/UI/HeaderWithBack';
import {
  removeSavedFrequency,
  setSavedFrequencies,
  clearSavedFrequencies,
} from '../../../redux/slice/savedFrequenciesSlice';
import { styles } from './styles';
import {audioController} from '../../../services/audio/AudioController'; // FIX: pause active audio before starting all-in-one
import {needsRefresh} from '../../../utils/functions';

const Frequencies = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const [selectedTab, setSelectedTab] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [countdownPickerVisible, setCountdownPickerVisible] =
    useState<boolean>(false);
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const user = useAppSelector(state => state.user);
  const userId = user?._id;
  const moods = useAppSelector(state => state.mood.allMoods);
  const moodsLastUpdated = useAppSelector(state => state.mood.lastUpdated);
  const savedFrequencies = useAppSelector(
    state => state.savedFrequencies.savedFrequencies,
  );
  const savedFrequenciesLastUpdated = useAppSelector(
    state => state.savedFrequencies.lastUpdated,
  );
  const hasMoods = moods.length > 0;
  const hasSavedFrequencies = savedFrequencies.length > 0;

  /** Busca Moods com TTL */
  const fetchMoods = useCallback(async () => {
    try {
      const response = await getMoodsAll();
      dispatch(setMoods(response?.data ?? []));
    } catch (err) {
      console.error('getMoods failed:', err);
    }
  }, [dispatch]);

  /** Frequências salvas do usuário */
  const loadFrequencies = useCallback(async () => {
    if (!userId) {
      dispatch(clearSavedFrequencies());
      return;
    }
    try {
      const data = await getSavedFrequencies(userId);
      dispatch(setSavedFrequencies(data ?? []));
    } catch (error) {
      console.error('Failed to load frequencies:', error);
    }
  }, [dispatch, userId]);

  const refreshData = useCallback(
    async ({
      forceMoods = false,
      forceSaved = false,
    }: {forceMoods?: boolean; forceSaved?: boolean} = {}) => {
      const shouldFetchMoods = forceMoods || needsRefresh(moodsLastUpdated);
      const shouldFetchSavedRaw =
        forceSaved || needsRefresh(savedFrequenciesLastUpdated);
      const shouldFetchSaved = shouldFetchSavedRaw && !!userId;

      if (!shouldFetchMoods && !shouldFetchSaved) {
        return;
      }

      setIsRefreshing(true);
      try {
        const requests: Promise<any>[] = [];
        if (shouldFetchMoods) {
          requests.push(fetchMoods());
        }
        if (shouldFetchSaved) {
          requests.push(loadFrequencies());
        }
        await Promise.all(requests);
      } finally {
        setIsRefreshing(false);
      }
    },
    [fetchMoods, loadFrequencies, moodsLastUpdated, savedFrequenciesLastUpdated, userId],
  );

  /** Ir para lista completa para adicionar */
  const handleAdd = useCallback(() => {
    navigate(routes.ALLFREQUENCIES);
  }, []);

  /** Remover uma frequência salva */
  const handleRemove = useCallback(
    async (item: FREQUENCY) => {
      try {
        await removeFrequency(item._id, user._id);
        dispatch(removeSavedFrequency(item._id));
        showToast('Frequency removed successfully.', 'success');
      } catch (error) {
        showToast('Failed to remove frequency.', 'error');
        console.error('Error removing frequency:', error);
      }
    },
    [dispatch, user._id],
  );

  /** Tocar uma única frequência */
  const handlePlay = useCallback(
    (item: FREQUENCY) => {
      dispatch(clearFrequencyQueue());
      dispatch(resetCurrentIndex());
      dispatch(addToFrequencyQueue(item));
      reset(routes.HOME);
    },
    [dispatch],
  );

  /** All-in-one (fila com duração por frequência) */
  const handleAllInOneListening = useCallback(
    (minutes: number, seconds: number) => {
      if (!savedFrequencies || savedFrequencies.length === 0) {
        showToast('No frequencies available for all-in-one listening', 'info');
        return;
      }
      const durationPerFrequency = minutes * 60 + seconds;
      audioController.pauseAll(); // FIX: stop any current playback before starting all-in-one
      dispatch(clearFrequencyQueue()); // FIX: clear existing queue to avoid mixing sessions
      dispatch(resetCurrentIndex()); // FIX: reset pointer so the new session starts from the first item
      dispatch(
        startAllInOneSession({
          frequencies: savedFrequencies,
          durationPerFrequency,
        }),
      );
      reset(routes.HOME);
    },
    [dispatch, savedFrequencies],
  );

  /** Voltar */
  const handleBack = () => {
    goBack();
  };

  /** Dados de Saved + card "Add" */
  const savedWithAdd = useMemo(
    () => [...savedFrequencies, { _id: 'add' } as any],
    [savedFrequencies],
  );

  /** Item da FlatList (Saved) */
  const renderFrequencyItem = useCallback(
    ({ item }: { item: FREQUENCY | { _id: 'add' } }) => {
      if ((item as any)._id === 'add') {
        return (
          <TouchableOpacity style={styles.addCard} onPress={handleAdd}>
            <Text style={styles.addText}>Add</Text>
            <SvgPlus />
          </TouchableOpacity>
        );
      }
      return (
        <FrequencyCard
          item={item as FREQUENCY}
          onPress={() => {
            if (mode === 'view') {
              handlePlay(item as FREQUENCY);
            }
          }}
          onRemove={handleRemove}
          showRemove={mode === 'edit'}
        />
      );
    },
    [mode, handleAdd, handlePlay, handleRemove],
  );

  /** inicializa cache apenas quando nunca carregou */
  useEffect(() => {
    const forceMoods = !moodsLastUpdated;
    const forceSaved = !!userId && !savedFrequenciesLastUpdated;
    if (forceMoods || forceSaved) {
      refreshData({forceMoods, forceSaved});
    }
  }, [refreshData, moodsLastUpdated, savedFrequenciesLastUpdated, userId]);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      refreshData({forceSaved: true});
    });
    return unsubscribeFocus;
  }, [navigation, refreshData]);

  /** Alterna modo de organização */
  const handleMode = () => {
    if (mode === 'view') {
      if (savedFrequencies.length === 0) {
        showToast("You haven't saved anything to organize yet.", 'info');
        return;
      }
      setMode('edit');
    } else {
      setMode('view');
    }
  };

  return (
    <Container>
      <Loader loading={!hasMoods && !hasSavedFrequencies && isRefreshing} />
      <LinearGradient
        colors={['#1E2746', '#113D56', '#045466']}
        style={styles.container}>
          <HeaderWithBack title={'Frequencies'} onBack={handleBack} />

          <SegmentControl
            segments={['Moods', 'Saved']}
            selectedIndex={selectedTab}
            onChange={index => {
              if (mode === 'edit' && index === 0) {
                showToast('Finish organizing before switching tabs.', 'info');
                return;
              }
              setSelectedTab(index);
            }}
          />
          {isRefreshing && (hasMoods || hasSavedFrequencies) ? (
            <></>
          ) : null}

          {selectedTab === 0 && (
            <FlatList
              data={moods}
              keyExtractor={item => item._id.toString()}
              numColumns={2}
              contentContainerStyle={styles.contentContainerStyle}
              style={styles.flatlistView}
              columnWrapperStyle={styles.columnWrapper}
              renderItem={({item}) => <MoodCard mood={item} />}
            />
          )}

          {selectedTab === 1 && (
            <>
              <FlatList
                data={savedWithAdd}
                keyExtractor={(item: any) => String(item._id)}
                numColumns={2}
                contentContainerStyle={styles.contentContainerStyle}
                style={styles.flatlistView}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={renderFrequencyItem}
                initialNumToRender={8}
                maxToRenderPerBatch={8}
                windowSize={7}
                removeClippedSubviews
              />

              <View>
                {mode === 'view' && (
                  <TouchableOpacity
                    onPress={() => setCountdownPickerVisible(true)}
                    style={styles.footer}>
                    <Text style={styles.footerText}>All-in-one listening</Text>
                    <SvgHeadphones width={38} height={38} />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={handleMode}
                  style={styles.removeFrequencyButton}>
                  <Text style={styles.footerEndText}>
                    {mode === 'view' ? 'Organize' : 'Finished'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <CountDownPickerModal
            visible={countdownPickerVisible}
            onClose={setCountdownPickerVisible}
            onConfirm={handleAllInOneListening}
          />
      </LinearGradient>
    </Container>
  );
};

export default Frequencies;
