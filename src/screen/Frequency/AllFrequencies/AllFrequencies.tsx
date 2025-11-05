import {
  FlatList,
  ListRenderItem,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {styles} from './styles';
import {SvgRightChev} from '../../../assets/svg';
import {goBack} from '../../../navigation/AppNavigator';
import {FREQUENCY} from '../../../redux/slice/moodSlice';
import LinearGradient from 'react-native-linear-gradient';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {getAllFrequencies} from '../../../service/frequency/getAllFrequencies';
import {setFrequencies} from '../../../redux/slice/frequencySlice';
import Loader from '../../../components/UI/Loader';
import {saveFrequency} from '../../../service/frequency/UserFrequencies/saveFrequency';
import showToast from '../../../components/UI/CustomToast/CustomToast';
import Container from '../../../components/layout/Container';
import {HeaderWithBack} from '../../../components/UI/HeaderWithBack';

const AllFrequencies = () => {
  const dispatch = useAppDispatch();
  const allFrequencies = useAppSelector(
    state => state.frequency.allFrequencies,
  );

  const user = useAppSelector(state => state.user);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const getFrequencies = async () => {
    setIsLoading(true);
    try {
      const response = await getAllFrequencies();
      dispatch(setFrequencies(response?.data));
    } catch (error: any) {
      console.error('Failed to fetch frequencies:', error);

      showToast(
        error?.data?.message || 'Could not load frequencies. Please try again.',
        'error',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    goBack();
  };

  useEffect(() => {
    getFrequencies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveFrequency = async (frequency: FREQUENCY, userId: string) => {
    try {
      setSavingId(frequency._id);
      await saveFrequency(frequency._id, userId);

      showToast('Frequency saved successfully!');

      goBack();
    } catch (error: any) {
      console.error('Save frequency error:', error);
      showToast(
        error?.data?.message || 'Failed to save frequency. Please try again.',
        'error',
      );
    } finally {
      setSavingId(null);
    }
  };

  const renderItem = useCallback<ListRenderItem<FREQUENCY>>(
    ({item}) => {
      const isSaving = savingId === item._id;
      return (
        <TouchableOpacity
          onPress={() => handleSaveFrequency(item, user._id)}
          style={[styles.itemContainer, isSaving && {opacity: 0.6}]}
          disabled={isSaving}>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {item.frequency_value ? item.frequency_value + ' Hz ' : null}
              {item.title}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          {isSaving ? <ActivityIndicator color="#fff" /> : <SvgRightChev />}
        </TouchableOpacity>
      );
    },
    [savingId, user._id],
  );

  return (
    <Container>
      <LinearGradient colors={['#1E2746', '#113D56', '#045466']} style={styles.container}>
        <Loader loading={isLoading} />
        <SafeAreaView style={styles.safeArea}>
          <HeaderWithBack title={'All Frequencies'} onBack={handleBack} />

          <FlatList
            data={allFrequencies}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            // ⚡ props de performance
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={7}
            removeClippedSubviews
          />
        </SafeAreaView>
      </LinearGradient>
    </Container>
  );
};

export default AllFrequencies;
