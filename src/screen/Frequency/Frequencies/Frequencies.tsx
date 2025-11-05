import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
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
} from '../../../redux/slice/savedFrequenciesSlice';
import { styles } from './styles';

/** TTL local para evitar refetch desnecessário */
const TTL_6H = 6 * 60 * 60 * 1000;
const shouldRefresh = (lastUpdated?: number, ttl = TTL_6H) =>
  !lastUpdated || Date.now() - lastUpdated > ttl;

const Frequencies = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const [selectedTab, setSelectedTab] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [countdownPickerVisible, setCountdownPickerVisible] =
    useState<boolean>(false);
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const user = useAppSelector(state => state.user);
  const moods = useAppSelector(state => state.mood.allMoods);
  const moodsLastUpdated = useAppSelector(state => state.mood.lastUpdated);
  const savedFrequencies = useAppSelector(
    state => state.savedFrequencies.savedFrequencies,
  );

  /** Busca Moods com TTL */
  const getMoods = useCallback(async () => {
    if (!shouldRefresh(moodsLastUpdated) && moods.length > 0) {return;}
    setIsLoading(true);
    try {
      const response = await getMoodsAll();
      dispatch(setMoods(response?.data ?? []));
    } catch (err) {
      console.error('getMoods failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, moods.length, moodsLastUpdated]);

  /** Frequências salvas do usuário */
  const loadFrequencies = useCallback(async () => {
    try {
      const data = await getSavedFrequencies(user._id);
      dispatch(setSavedFrequencies(data ?? []));
    } catch (error) {
      console.error('Failed to load frequencies:', error);
    }
  }, [dispatch, user._id]);

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

  /** Um único listener de focus */
  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      getMoods();
      loadFrequencies();
    });
    return unsubscribeFocus;
  }, [navigation, getMoods, loadFrequencies]);

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
      <Loader loading={isLoading} />
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
