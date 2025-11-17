// BottomHomeModal.tsx
import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {View, TouchableOpacity, Modal, Text, ScrollView, Image, InteractionManager} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './styles';
import {SvgMenuDot, SvgHeart} from '../../../assets/svg';
import {navigate} from '../../../navigation/AppNavigator';
import TipCard from '../../../components/UI/TipCard';
import StatsBar from '../../../components/UI/BottomStatusBar';
import routes from '../../../constants/routes';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {toggleNightAndLoad} from '../../../redux/slice/nightModeSlice';
import {
  addSavedVideo,
  removeSavedVideo,
} from '../../../redux/slice/savedVideosSlice';
import VolumeSlider from '../../../components/UI/VolumeSlider/VolumeSlider';
import {FREQUENCY} from '../../../redux/slice/moodSlice';
import PlayControls from '../../../components/Features/Home/PlayControls/PlayControls';
import BottomButtons from '../../../components/Features/Home/BottomButtons/BottomButtons';
import BackgroundWrapper from '../../../components/UI/BackgroundWrapper';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {runOnJS, useSharedValue, withSpring} from 'react-native-reanimated';
import {GlobalFeatures} from '../../../hooks/Home/useHomeState';
import {audioController} from '../../../services/audio/AudioController';
import {saveVideo} from '../../../service/video/saveVideo';
import {removeVideo} from '../../../service/video/removeVideo';
import showToast from '../../../components/UI/CustomToast/CustomToast';
import GuestVideoPromptModal from '../../../components/UI/GuestVideoPromptModal/GuestVideoPromptModal';
import GuestAuthModal from '../../../components/UI/GuestAuthModal/GuestAuthModal';

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
  onVoiceGuidePress: () => void;
  onSharePress: (frequency: FREQUENCY) => void;
}

type VideoEntry = {
  title?: string;
  subtitle?: string;
  url?: string;
  thumbnail?: string;
  cover_url?: string; // capa enviada pelo painel (opção 1)
  // pode existir _id se vier do servidor
  _id?: string;
};

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
  onVoiceGuidePress,
  onSharePress,
}) => {
  const [isPlayingState, setIsPlayingState] = useState(isPlaying || false);
  const [pendingVideoId, setPendingVideoId] = useState<string | null>(null);
  const [guestVideoModalVisible, setGuestVideoModalVisible] = useState(false);
  const [guestAuthModalVisible, setGuestAuthModalVisible] = useState(false);
  const [pendingGuestRoute, setPendingGuestRoute] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const translateY = useSharedValue(0);
  const night = useAppSelector(state => state.nightMode.isNightMode);
  const savedVideos = useAppSelector(state => state.savedVideos.savedVideos);
  const user = useAppSelector(state => state.user);
  // const isGuestUser = useMemo(
  //   () => user?.provider === 'guest' || user?.isAnonymous,
  //   [user?._id, user?.isAnonymous, user?.provider],
  // );
  const isGuestUser = false;

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
    if (!currentFrequency) {setIsPlayingState(false);}
  }, [currentFrequency]);

  useEffect(() => {
    setIsPlayingState(isPlaying);
  }, [isPlaying]);

  // =========================
  //    usar videos[]
  // =========================
  const videos: VideoEntry[] = useMemo(() => {
    const raw = globalFeatures?.weekly_tip_videos;
    if (!Array.isArray(raw)) {
      return [];
    }
    return raw.filter(v => isVideoUrl(v?.url));
  }, [globalFeatures?.weekly_tip_videos]);

  const poster = useMemo(
    () => currentFrequency?.background_image || currentFrequency?.photo_url,
    [currentFrequency?.background_image, currentFrequency?.photo_url],
  );

  const savedVideosMap = useMemo(() => {
    const map = new Map<string, (typeof savedVideos)[number]>();
    savedVideos.forEach(video => {
      map.set(video.id, video);
    });
    return map;
  }, [savedVideos]);

  const toggleFavorite = useCallback(
    async (id: string, video: VideoEntry) => {
      // if (isGuestUser) {
      //   setGuestAuthModalVisible(true);
      //   return;
      // }

      if (!video?.url || pendingVideoId) {return;}

      const existing = savedVideosMap.get(id);
      try {
        if (existing) {
          setPendingVideoId(id);

          // Se tivermos savedId, removemos no back-end (preferível; evita problemas com URLs na rota)
          if (existing.savedId) {
            await removeVideo(existing.savedId);
          } else {
            // sem savedId, apenas remove da store (evita DELETE com URL no path)
          }

          dispatch(
            removeSavedVideo(
              existing.savedId
                ? { savedId: existing.savedId }
                : { id: existing.id },
            ),
          );
          showToast('Video removed from favorites.', 'info');
        } else {
          if (!user?._id) {
            showToast('Faça login para salvar vídeos.', 'info');
            return;
          }

          setPendingVideoId(id);

          // Ao salvar, definimos video_id exatamente como o id usado no card
          const payload = {
            video_id: (video as any)?._id || id,
            frequency_id: currentFrequency?._id,
            title: video.title || currentFrequency?.title || 'Saved Video',
            subtitle: video.subtitle,
            url: video.url,
            thumbnail:
              video?.cover_url ||
              video?.thumbnail ||
              poster ||
              currentFrequency?.background_image_night,
          };

          // saveVideo retorna { success, data }
          const response = await saveVideo(payload);
          const server = response?.data as any; // mapeado por mapSavedVideo no back

          const savedId = server?.savedId;                       // _id do registro salvo
          const serverId = server?.id ?? id;                     // video_id normalizado no servidor
          const serverUrl = server?.url ?? payload.url;
          const serverTitle = server?.title ?? payload.title;
          const serverSubtitle = server?.subtitle ?? payload.subtitle;
          const serverFrequencyId = server?.frequencyId ?? payload.frequency_id;
          const serverFrequencyTitle = server?.frequencyTitle ?? currentFrequency?.title;
          const serverBackground = server?.thumbnail ?? server?.background ?? payload.thumbnail;
          const serverSavedAt = server?.savedAt;                 // timestamp do back, se houver

          dispatch(
            addSavedVideo({
              id: serverId,
              savedId,
              url: serverUrl,
              title: serverTitle,
              subtitle: serverSubtitle,
              frequencyId: serverFrequencyId,
              frequencyTitle: serverFrequencyTitle,
              background: serverBackground,
              savedAt: serverSavedAt,
            }),
          );
          showToast('Video saved to favorites!', 'success');
        }
      } catch (error) {
        console.error('Failed to toggle saved video:', error);
        showToast('Could not update your favorite.', 'error');
      } finally {
        setPendingVideoId(null);
      }
    },
    [
      currentFrequency?._id,
      currentFrequency?.title,
      dispatch,
      poster,
      savedVideosMap,
      user?._id,
      pendingVideoId,
      isGuestUser,
    ],
  );

  // Controle do player expandido
  const handleVideoCardPress = useCallback(
    (video: VideoEntry, cardPoster?: string) => {
      if (!video?.url) {return;}

      // if (isGuestUser) {
      //   setGuestVideoModalVisible(true);
      //   return;
      // }

      pauseMusic();
      setIsPlayingState(false);
      audioController.pauseAll();
      onClose();

      setTimeout(() => {
        navigate(routes.FULLSCREEN_VIDEO, {
          videoUrl: video.url as string,
          poster: cardPoster,
          title: video.title,
        });
      }, 200);
    },
    [isGuestUser, onClose, pauseMusic],
  );

  const handleVoiceGuidePress = useCallback(
    (_frequency?: FREQUENCY) => {
      onClose();
      setTimeout(() => {
        onVoiceGuidePress();
      }, 200);
    },
    [onClose, onVoiceGuidePress],
  );

  const handleSharePress = useCallback(() => {
    if (!currentFrequency) {return;}
    onClose();
    setTimeout(() => {
      onSharePress(currentFrequency);
    }, 200);
  }, [currentFrequency, onClose, onSharePress]);

  // const closeGuestVideoModal = () => setGuestVideoModalVisible(false);

  // const handleGuestPromptCta = () => {
  //   setGuestVideoModalVisible(false);
  //   setGuestAuthModalVisible(true);
  // };

  // const closeGuestAuthModal = () => setGuestAuthModalVisible(false);

  // const handleGuestAuthNavigate = (route: string) => {
  //   setGuestAuthModalVisible(false);
  //   setPendingGuestRoute(route);
  //   onClose();
  // };

  useEffect(() => {
    if (!isVisible) {
      setGuestVideoModalVisible(false);
      setGuestAuthModalVisible(false);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!pendingGuestRoute || isVisible) {
      return;
    }

    const routeToNavigate = pendingGuestRoute;
    setPendingGuestRoute(null);

    InteractionManager.runAfterInteractions(() => {
      navigate(routes.HOME);
      if (routeToNavigate && routeToNavigate !== routes.HOME) {
        InteractionManager.runAfterInteractions(() => {
          navigate(routeToNavigate);
        });
      }
    });
  }, [isVisible, pendingGuestRoute]);

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
            <BackgroundWrapper night={night} currentFrequency={currentFrequency}>
              <SafeAreaView edges={['top', 'bottom']} style={styles.safeView}>
                {/* Header with close chevron and menu */}
                {/* <View style={styles.safeChevronView}>
                  <TouchableOpacity onPress={onClose} style={styles.chevButtonStyle}>
                    <LottieView
                      source={images.lottieDownChevronAnimation}
                      autoPlay
                      loop
                      style={styles.chevronStyle}
                    />
                  </TouchableOpacity>
                </View> */}

                <View style={styles.headerView}>
                  <TouchableOpacity style={styles.menuButton} onPress={navigateSettings}>
                    <SvgMenuDot />
                  </TouchableOpacity>
                </View>

                {/* Volume slider */}
                <VolumeSlider setVolume={setVolume} />
                <View style={styles.volume}/>
                <BottomButtons
                  currentFrequency={currentFrequency}
                  onInfoPress={handleVoiceGuidePress}
                  onVoiceSettingPress={handleSharePress}
                />

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
                  <TipCard title="WEEKLY TIP" content={globalFeatures?.weekly_tip} />

                  {/* Cards arredondados a partir de videos[] */}
                  {videos.length ? (
                    <View style={styles.videoList}>
                      {videos.map((v, idx) => {
                        // Unificar ID do card com o que enviamos ao servidor
                        const cardId =
                          (v as any)?._id ||
                          v.url ||
                          `${currentFrequency?._id || 'video'}-${idx}`;

                        const isFavorite = savedVideosMap.has(cardId);
                        const cardPoster = v.cover_url || v.thumbnail || poster;

                        return (
                          <TouchableOpacity
                            key={cardId}
                            activeOpacity={0.9}
                            onPress={() => handleVideoCardPress(v, cardPoster)}
                            style={[
                              styles.videoCard,
                              idx === videos.length - 1 && styles.videoCardLast,
                            ]}>
                            <View style={styles.videoFrame}>
                              {/* Apenas IMAGEM no card (sem <Video/>) */}
                              {!!cardPoster && (
                                <Image
                                  source={{uri: cardPoster}}
                                  style={styles.video}
                                  resizeMode="cover"
                                />
                              )}

                              <View style={styles.videoOverlay} />

                              {!!v.url && (
                                <TouchableOpacity
                                  activeOpacity={0.8}
                                  onPress={event => {
                                    event.stopPropagation?.();
                                    toggleFavorite(cardId, v);
                                  }}
                                  disabled={pendingVideoId === cardId}
                                  style={styles.favoriteButton}>
                                  <SvgHeart size={20} filled={isFavorite} />
                                </TouchableOpacity>
                              )}

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
                        );
                      })}
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
                  )}

                  <View style={{position: 'absolute', bottom: 5}}>
                    <StatsBar
                      bottomLeftCornerQuote={globalFeatures?.bottom_left_corner_quote}
                      onSavedPress={() => {
                        onClose();
                        navigate(routes.SAVED_VIDEOS);
                      }}
                    />
                  </View>
                </View>
              </SafeAreaView>
            </BackgroundWrapper>
          </View>
          {/* <GuestVideoPromptModal
            visible={guestVideoModalVisible}
            onClose={closeGuestVideoModal}
            onSignUpPress={handleGuestPromptCta}
          />
          <GuestAuthModal
            visible={guestAuthModalVisible}
            onClose={closeGuestAuthModal}
            onSignUpPress={() => handleGuestAuthNavigate(routes.SIGN_UP)}
            onLoginPress={() => handleGuestAuthNavigate(routes.SIGN_IN)}
          /> */}
        </View>
      </GestureDetector>
    </Modal>
  );
};

export default BottomHomeModal;
