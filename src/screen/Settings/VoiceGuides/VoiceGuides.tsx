import React, {useEffect, useState} from 'react';
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
import {getAllTutors} from '../../../service/tutors/getAllTutors';
import showToast from '../../../components/UI/CustomToast/CustomToast';
import {useAppSelector} from '../../../redux/store';
import {useDispatch} from 'react-redux';
import {setAllTutors, setSelectedTutor} from '../../../redux/slice/tutorSlice';
import {TutorResponse} from '../../../utils/types';
import {HeaderWithBack} from '../../../components/UI/HeaderWithBack';

const VoiceGuides: React.FC = () => {
  const dispatch = useDispatch();
  const tutors = useAppSelector(state => state.tutor.allTutors);
  const selectedTutor = useAppSelector(state => state.tutor.selectedTutor);
  const [loading, setLoading] = useState<boolean>(true);

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

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const response: TutorResponse[] = await getAllTutors();

      console.log('response', response);

      dispatch(setAllTutors(response));
    } catch (err) {
      console.error('Error fetching tutors:', err);
      showToast('Failed to load voice guides', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTutors = (tutor: TutorResponse) => {
    dispatch(setSelectedTutor(tutor));
  };

  useEffect(() => {
    fetchTutors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      );
    }

    if (tutors.length === 0 && !loading) {
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
            onPress={() => handleSelectTutors(tutor)}
            style={[
              styles.guideCard,
              tutor._id === selectedTutor?._id
                ? styles.lightBackgroundCard
                : styles.darkBackgroundCard,
            ]}>
            <View style={styles.guideInfoContainer}>
              <Image
                source={{uri: tutor.profile_picture}}
                style={styles.guideImage}
              />

              <View style={styles.guideTextContainer}>
                <Text
                  style={
                    tutor._id === selectedTutor?._id
                      ? styles.guideNameDark
                      : styles.guideNameLight
                  }>
                  {tutor.name}
                </Text>
                <Text
                  style={
                    tutor._id === selectedTutor?._id
                      ? styles.guideTitleDark
                      : styles.guideTitleLight
                  }>
                  {determineTitle(tutor.bio)}
                </Text>
              </View>
            </View>
            <Text
              style={
                tutor._id === selectedTutor?._id
                  ? styles.guideDescriptionDark
                  : styles.guideDescriptionLight
              }
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
