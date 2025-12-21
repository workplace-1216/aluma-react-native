import React, {useCallback, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {goBack} from '../../../navigation/AppNavigator';
import Container from '../../../components/layout/Container';
import {styles} from './styles';
import showToast from '../../../components/UI/CustomToast/CustomToast';
import {useAppSelector} from '../../../redux/store';
import {useDispatch} from 'react-redux';
import {fetchTutorsOnce} from '../../../service/tutors/fetchTutorsOnce';
import {TutorResponse} from '../../../utils/types';
import {HeaderWithBack} from '../../../components/UI/HeaderWithBack';

const VoiceGuides: React.FC = () => {
  const dispatch = useDispatch();
  const tutors = useAppSelector(state => state.tutor.allTutors);
  const tutorsStatus = useAppSelector(state => state.tutor.status);
  const tutorsError = useAppSelector(state => state.tutor.error);

  const formatTutorName = (name?: string | null) => {
    const normalized = (name ?? '').trim().toLowerCase();
    if (normalized === 'voicefree') {
      return 'No voice';
    }
    return name || '';
  };

  const determineTitle = (bio: string): string => {
    const bioLower = bio.toLowerCase();
    if (bioLower.includes('yoga')) {
      return 'Yoga Teacher';
    } else if (bioLower.includes('meditation')) {
      return 'Meditation Teacher';
    } else if (bioLower.includes('coach')) {
      return 'Breathing Coach';
    } else {
      return 'Wellness Guide';
    }
  };

  const handleRetry = useCallback(() => {
    fetchTutorsOnce(dispatch, {force: true}).catch(err => {
      console.error('Error refreshing tutors:', err);
      showToast('Failed to load voice guides', 'error');
    });
  }, [dispatch]);

  useEffect(() => {
    fetchTutorsOnce(dispatch).catch(err => {
      console.error('Error fetching tutors:', err);
    });
  }, [dispatch]);

  const renderContent = () => {
    if (tutorsStatus === 'loading') {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      );
    }

    if (tutorsStatus === 'error' && tutors.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Falha ao carregar instrutores. Tente novamente.
          </Text>
          <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (tutors.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No voice guides available</Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {tutors.map(tutor => (
          <TouchableOpacity
            key={tutor._id}
            style={[
              styles.guideCard,
              styles.darkBackgroundCard,
            ]}>
            <View style={styles.guideInfoContainer}>
              <Image
                source={{uri: tutor.profile_picture}}
                style={styles.guideImage}
              />

              <View style={styles.guideTextContainer}>
                <Text
                  style={styles.guideNameLight}>
                  {formatTutorName(tutor.name)}
                </Text>
                <Text
                  style={styles.guideTitleLight}>
                  {determineTitle(tutor.bio)}
                </Text>
              </View>
            </View>
            <Text
              style={styles.guideDescriptionLight}
              numberOfLines={6}
              ellipsizeMode="tail">
              {tutor.bio}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <Container>
      <View style={styles.container}>
        <HeaderWithBack title={'Voice Guides'} onBack={goBack} />
        {renderContent()}
      </View>
    </Container>
  );
};

export default VoiceGuides;
