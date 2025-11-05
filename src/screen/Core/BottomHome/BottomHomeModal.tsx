// BottomHomeModal.tsx
import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {View, TouchableOpacity, Modal, Text, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import images from '../../../assets/images';
import {styles} from './styles';
import {SvgMenuDot, SvgBack} from '../../../assets/svg';
import {navigate} from '../../../navigation/AppNavigator';
import TipCard from '../../../components/UI/TipCard';
import StatsBar from '../../../components/UI/BottomStatusBar';
import routes from '../../../constants/routes';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {toggleNightAndLoad} from '../../../redux/slice/nightModeSlice';
import VolumeSlider from '../../../components/UI/VolumeSlider/VolumeSlider';
import LottieView from 'lottie-react-native';
import {FREQUENCY} from '../../../redux/slice/moodSlice';
import PlayControls from '../../../components/Features/Home/PlayControls/PlayControls';
import BackgroundWrapper from '../../../components/UI/BackgroundWrapper';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {runOnJS, useSharedValue, withSpring} from 'react-native-reanimated';
import {GlobalFeatures} from '../../../hooks/Home/useHomeState';
import Video from 'react-native-video';
import {audioController} from '../../../services/audio/AudioController';

interface BottomHomeModalProps {
  globalFeatures: GlobalFeatures;
  isVisible: boolean;
  onClose: () => void;
  isPlaying: boolean;
  exercise: any;
  onBackFromExercise: () => void;
  play: () => void;
  pauseMusic: () => void;
  setVolume: (volume: number) => void;
  currentFrequency?: FREQUENCY;
}

type VideoEntry = { title?: string; subtitle?: string; url?: string };

const isUrl = (s?: string) =>
  typeof s === 'string' && /^https?:\/\//i.test(s ?? '');
const isVideoUrl = (u?: string) => {
  if (!isUrl(u)) {return false;}
  const clean = (u as string).split('?')[0].toLowerCase();
  return /\.(mp4|mov|m4v|webm|mkv|avi|mpg|mpeg)$/.test(clean);
};

const BottomHomeModal: React.FC<BottomHomeModalProps> = ({
  globalFeatures,
  isVisible,
  onClose,
  isPlaying,
  exercise,
  onBackFromExercise,
  play,
  pauseMusic,
  setVolume,
  currentFrequency,
}) => {
  const [isPlayingState, setIsPlayingState] = useState(isPlaying || false);
  const dispatch = useAppDispatch();
  const translateY = useSharedValue(0);
  const night = useAppSelector(state => state.nightMode.isNightMode);

  const handleNavigation = () => {
    onClose();
  };

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      translateY.value = event.translationY;
    })
    .onEnd(event => {
      if (event.velocityY > 100) {
        runOnJS(handleNavigation)();
      } else {
        translateY.value = withSpring(0);
      }
    });

  const navigateSettings = useCallback(() => {
    onClose();
    setTimeout(() => {
      navigate(routes.SETTINGS);
    }, 200);
  }, [onClose]);

  const setNight = useCallback(() => {
    dispatch(toggleNightAndLoad());
    audioController.pauseAll();
  }, [dispatch]);

  useEffect(() => {
    if (!currentFrequency) {
      setIsPlayingState(false);
    }
  }, [currentFrequency]);

  useEffect(() => {
    setIsPlayingState(isPlaying);
  }, [isPlaying]);

  // =========================
  //    NOVO: usar videos[]
  // =========================
  const videos: VideoEntry[] = useMemo(() => {
    const raw = (currentFrequency as any)?.videos;
    if (!Array.isArray(raw)) {return [];}
    return raw.filter(v => isVideoUrl(v?.url));
  }, [currentFrequency]);

  const poster = useMemo(
    () => currentFrequency?.background_image || currentFrequency?.photo_url,
    [currentFrequency?.background_image, currentFrequency?.photo_url],
  );

  // Controle do player expandido
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const expanded = expandedIndex !== null;
  const expandedVideo = expanded ? videos[expandedIndex!] : null;

  // cleanup quando o modal fecha
  useEffect(() => {
    if (!isVisible) {setExpandedIndex(null);}
  }, [isVisible]);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      statusBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={onClose}>
      <GestureDetector gesture={panGesture}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalOverlay} onPress={onClose} />

          <View style={styles.modalContentFullScreen}>
            <BackgroundWrapper
              night={night}
              currentFrequency={currentFrequency}>
              <SafeAreaView edges={['top', 'bottom']} style={styles.safeView}>
                {/* Header with close chevron and menu */}
                <View style={styles.safeChevronView}>
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.chevButtonStyle}>
                    <LottieView
                      source={images.lottieDownChevronAnimation}
                      autoPlay
                      loop
                      style={styles.chevronStyle}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.headerView}>
                  <TouchableOpacity
                    style={styles.menuButton}
                    onPress={navigateSettings}>
                    <SvgMenuDot />
                  </TouchableOpacity>
                </View>

                {/* Volume slider */}
                <VolumeSlider setVolume={setVolume} />

                {/* Play controls */}
                <View style={styles.playButtonView}>
                  <PlayControls
                    exercise={exercise}
                    isPlaying={isPlayingState}
                    onExerciseBack={onBackFromExercise}
                    onPlay={() => {
                      isPlayingState ? pauseMusic() : play();
                      setIsPlayingState(!isPlayingState);
                    }}
                    onPause={() => {
                      pauseMusic();
                      setIsPlayingState(false);
                    }}
                    night={night}
                    onToggleNight={setNight}
                  />
                </View>

                {/* Tips and stats */}
                <View style={styles.tipsView}>
                  {!expanded && (
                    <TipCard
                      title="WEEKLY TIP"
                      content={globalFeatures?.weekly_tip}
                    />
                  )}

                  {/* Cards arredondados a partir de videos[] */}
                  {!expanded ? (
                    videos.length ? (
                      <View style={styles.videoList}>
                        {videos.map((v, idx) => (
                          <TouchableOpacity
                            key={`${v.url}-${idx}`}
                            activeOpacity={0.9}
                            onPress={() => setExpandedIndex(idx)}
                            style={styles.videoCard}>
                            <View style={styles.videoFrame}>
                              <Video
                                key={`card-${idx}`}
                                source={{uri: v.url!}}
                                style={styles.video}
                                resizeMode="cover"
                                paused
                                controls={false}
                                poster={poster}
                                posterResizeMode="cover"
                                playInBackground={false}
                                playWhenInactive={false}
                              />
                              <View style={styles.videoOverlay} />
                              {!!v.subtitle && (
                                <Text numberOfLines={1} style={styles.videoSubtitle}>
                                  {v.subtitle}
                                </Text>
                              )}
                              {!!v.title && (
                                <Text numberOfLines={2} style={styles.videoTitle}>
                                  {v.title}
                                </Text>
                              )}
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ) : (
                      <ScrollView
                        style={styles.tipScroll}
                        contentContainerStyle={styles.tipScrollContent}
                        showsVerticalScrollIndicator={false}>
                        <Text style={styles.tipText}>
                          {currentFrequency?.detailed_information ||
                            globalFeatures?.ujjayi_breathe ||
                            ''}
                        </Text>
                      </ScrollView>
                    )
                  ) : (
                    // Player expandido
                    <View style={styles.videoExpandedContainer}>
                      <View style={styles.videoExpandedFrame}>
                        <Video
                          key={`expanded-${expandedIndex}`}
                          source={{uri: expandedVideo?.url!}}
                          style={styles.videoExpanded}
                          controls
                          resizeMode="cover"
                          paused={false}
                          poster={poster}
                          posterResizeMode="cover"
                          playInBackground={false}
                          playWhenInactive={false}
                        />
                      </View>

                      <View style={styles.videoToolbar}>
                        <TouchableOpacity
                          activeOpacity={0.9}
                          onPress={() => setExpandedIndex(null)}
                          style={styles.returnButton}>
                          <SvgBack />
                        </TouchableOpacity>

                        <View style={styles.expandedTitles}>
                          {!!expandedVideo?.subtitle && (
                            <Text numberOfLines={1} style={styles.expandedSubtitle}>
                              {expandedVideo?.subtitle}
                            </Text>
                          )}
                          {!!expandedVideo?.title && (
                            <Text numberOfLines={2} style={styles.expandedTitle}>
                              {expandedVideo?.title}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  )}

                  <View style={{position: 'absolute', bottom: 5}}>
                    <StatsBar
                      bottomLeftCornerQuote={
                        globalFeatures?.bottom_left_corner_quote
                      }
                    />
                  </View>
                </View>
              </SafeAreaView>
            </BackgroundWrapper>
          </View>
        </View>
      </GestureDetector>
    </Modal>
  );
};

export default BottomHomeModal;
