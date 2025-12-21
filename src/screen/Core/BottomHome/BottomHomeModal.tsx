// BottomHomeModal.tsx
import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  InteractionManager,
  Dimensions,
} from 'react-native';
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
import Animated, {
  runOnJS,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {GlobalFeatures} from '../../../hooks/Home/useHomeState';
import {audioController} from '../../../services/audio/AudioController';
import {logAudioEvent} from '../../../services/audio/devAudioLogger';
import {saveVideo} from '../../../service/video/saveVideo';
import {removeVideo} from '../../../service/video/removeVideo';
import showToast from '../../../components/UI/CustomToast/CustomToast';
import GuestVideoPromptModal from '../../../components/UI/GuestVideoPromptModal/GuestVideoPromptModal';
import GuestAuthModal from '../../../components/UI/GuestAuthModal/GuestAuthModal';

interface BottomHomeModalProps {
  globalFeatures: GlobalFeatures;
  isVisible: boolean;
  onClose: () => void;
  onRequireSubscription: () => void;
  isPlaying: boolean;
  exercise: any;
  onBackFromExercise: () => void;
  play: () => void;
  pauseMusic: () => void;
  setVolume: (volume: number) => void;
  currentFrequency?: FREQUENCY;
  backgroundFrequency?: FREQUENCY;
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

const SCREEN_HEIGHT = Dimensions.get('window').height;
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const BottomHomeModal: React.FC<BottomHomeModalProps> = ({
  globalFeatures,
  isVisible,
  onClose,
  onRequireSubscription,
  isPlaying,
  exercise,
  onBackFromExercise,
  play,
  pauseMusic,
  setVolume,
  currentFrequency,
  backgroundFrequency,
  onVoiceGuidePress,
  onSharePress,
}) => {
  const [isPlayingState, setIsPlayingState] = useState(isPlaying || false);
  const [pendingVideoId, setPendingVideoId] = useState<string | null>(null);
  const [guestVideoModalVisible, setGuestVideoModalVisible] = useState(false);
  const [guestAuthModalVisible, setGuestAuthModalVisible] = useState(false);
  const [pendingGuestRoute, setPendingGuestRoute] = useState<string | null>(null);
  const [shouldRender, setShouldRender] = useState(isVisible);
  const dispatch = useAppDispatch();
  const translateY = useSharedValue(isVisible ? 0 : SCREEN_HEIGHT);
  const gestureContext = useSharedValue(0);
  const night = useAppSelector(state => state.nightMode.isNightMode);
  const savedVideos = useAppSelector(state => state.savedVideos.savedVideos);
  const user = useAppSelector(state => state.user);
  const isFreePlan = (user?.subscription?.plan ?? 'free') === 'free';
  // const isGuestUser = useMemo(
  //   () => user?.provider === 'guest' || user?.isAnonymous,
  //   [user?._id, user?.isAnonymous, user?.provider],
  // );
  const isGuestUser = false;

  useEffect(() => {
    logAudioEvent({
      action: 'bottomHomeModalMounted',
      route: routes.HOME,
      callsite: 'BottomHomeModal.lifecycle',
    });

    return () => {
      logAudioEvent({
        action: 'bottomHomeModalUnmounted',
        route: routes.HOME,
        callsite: 'BottomHomeModal.lifecycle',
      });
    };
  }, []);

  const handleNavigation = () => {
    logAudioEvent({
      action: 'bottomHomeModalDismissed',
      route: routes.HOME,
      callsite: 'BottomHomeModal.handleNavigation',
    });
    onClose();
  };

  useEffect(() => {
    logAudioEvent({
      action: 'bottomHomeModalVisibility',
      route: routes.HOME,
      callsite: 'BottomHomeModal.visibility',
      payload: {
        isVisible,
      },
    });
  }, [isVisible]);

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    const progress = Math.min(1, translateY.value / SCREEN_HEIGHT);
    return { opacity: 1 - progress };
  });

  const hideSheet = useCallback(() => setShouldRender(false), []);

  useEffect(() => {
    if (isVisible) {
      if (!shouldRender) {
        setShouldRender(true);
      }
      translateY.value = withTiming(0, { duration: 250 });
      return;
    }
    if (!shouldRender) {
      return;
    }
    translateY.value = withTiming(
      SCREEN_HEIGHT,
      { duration: 250 },
      finished => {
        if (finished) {
          runOnJS(hideSheet)();
        }
      },
    );
  }, [hideSheet, isVisible, shouldRender, translateY]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      gestureContext.value = translateY.value;
    })
    .onUpdate(event => {
      const clamped = Math.min(
        SCREEN_HEIGHT,
        Math.max(0, gestureContext.value + event.translationY),
      );
      translateY.value = clamped;
    })
    .onEnd(event => {
      const shouldDismiss =
        event.velocityY > 150 || translateY.value > SCREEN_HEIGHT / 3;
      if (shouldDismiss) {
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
  }, [dispatch]);

  useEffect(() => {
    if (!currentFrequency) {setIsPlayingState(false);}
  }, [currentFrequency]);

  const handleModalPlayPress = useCallback(() => {
    logAudioEvent({
      action: 'bottomHomeModalPlayPressed',
      route: routes.HOME,
      callsite: 'BottomHomeModal.PlayControls',
    });
    play();
  }, [play]);

  const handleModalPausePress = useCallback(() => {
    logAudioEvent({
      action: 'bottomHomeModalPausePressed',
      route: routes.HOME,
      callsite: 'BottomHomeModal.PlayControls',
    });
    pauseMusic();
  }, [pauseMusic]);

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

  const poster = useMemo(() => {
    const base = backgroundFrequency ?? currentFrequency;
    return base?.background_image || base?.photo_url;
  }, [
    backgroundFrequency?.background_image,
    backgroundFrequency?.photo_url,
    currentFrequency?.background_image,
    currentFrequency?.photo_url,
  ]);

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

      if (isFreePlan) {
        onClose();
        onRequireSubscription();
        return;
      }

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
    [isFreePlan, isGuestUser, onClose, onRequireSubscription, pauseMusic],
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

  if (!shouldRender) {
    return null;
  }

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.modalContainer}>
        <AnimatedTouchableOpacity
          style={[styles.modalOverlay, overlayAnimatedStyle]}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[styles.modalContentFullScreen, sheetAnimatedStyle]}>
          <BackgroundWrapper
            night={night}
            currentFrequency={backgroundFrequency ?? currentFrequency}>
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
                    handleModalPlayPress();
                    setIsPlayingState(true);
                  }}
                  onPause={() => {
                    handleModalPausePress();
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
        </Animated.View>
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
  );
};

export default BottomHomeModal;
