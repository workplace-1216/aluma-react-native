// src/screens/SavedVideos/index.tsx
import React, {useMemo, useCallback, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Container from '../../../components/layout/Container';
import {HeaderWithBack} from '../../../components/UI/HeaderWithBack';
import {goBack, navigate} from '../../../navigation/AppNavigator';
import {styles} from './styles';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {SavedVideoItem, removeSavedVideo} from '../../../redux/slice/savedVideosSlice';
import {SvgHeart} from '../../../assets/svg';
import {removeVideo} from '../../../service/video/removeVideo';
import showToast from '../../../components/UI/CustomToast/CustomToast';
import routes from '../../../constants/routes';
import {audioController} from '../../../services/audio/AudioController';
import RenderSubscriptionBottomSheet from '../../../components/Features/Home/RenderSubscriptionBottomSheet';
import {SubscriptionPlan} from '../../../utils/types';

const SavedVideos: React.FC = () => {
  const dispatch = useAppDispatch();
  const savedVideos = useAppSelector(state => state.savedVideos.savedVideos);
  const user = useAppSelector(state => state.user);
  const [isSubscription, setIsSubscription] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('monthly');

  const orderedVideos = useMemo(
    () => [...savedVideos].sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0)),
    [savedVideos],
  );

  const onToggleHeart = useCallback(async (item: SavedVideoItem) => {
    try {
      if (item.savedId) {
        await removeVideo(item.savedId); // persiste a exclusão no servidor
      }
      dispatch(
        item.savedId
          ? removeSavedVideo({ savedId: item.savedId })
          : removeSavedVideo({
              id: item.id,
            }),
      );
      showToast('Video removed from favorites.', 'info');
        } catch (e) {
      console.error('Failed to remove saved video:', e);
      showToast('Could not remove the favorite.', 'error');
    }
  }, [dispatch]);

  const handlePlay = useCallback((item: SavedVideoItem) => {
    if (!item?.url) {return;}
    const isFreePlan = (user?.subscription?.plan ?? 'free') === 'free';

    if (isFreePlan) {
      setIsSubscription(true);
      return;
    }

    audioController.pauseAll();
    navigate(routes.FULLSCREEN_VIDEO, {
      videoUrl: item.url,
      poster: item.background,
      title: item.title,
      reopenBottomModal: false,
    } as any);
  }, [user?.subscription?.plan]);

  const renderItem = useCallback(
    ({item}: {item: SavedVideoItem}) => {
      const CardInner = (
        <>
          {/* overlay abaixo dos textos/ícones */}
          <View style={styles.videoOverlay} />

          {/* coração no topo direito */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={(e) => {
              e.stopPropagation?.();
              onToggleHeart(item);
            }}
            style={styles.favoriteButton}
          >
            <SvgHeart size={22} filled />
          </TouchableOpacity>

          {/* subtitle topo-esquerdo */}
          {!!item.subtitle && (
            <Text numberOfLines={1} style={styles.videoSubtitle}>
              {item.subtitle}
            </Text>
          )}

          {/* title central */}
          {!!item.title && (
            <Text numberOfLines={2} style={styles.videoTitle}>
              {item.title}
            </Text>
          )}
        </>
      );

      return (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.videoCard}
          onPress={() => handlePlay(item)}>
          <View style={styles.videoFrame}>
            {item.background ? (
              <>
                <FastImage
                  source={{uri: item.background}}
                  style={styles.video}
                  resizeMode={FastImage.resizeMode.cover}
                />
                {CardInner}
              </>
            ) : (
              <View style={styles.fallbackThumbnail}>
                {CardInner}
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [handlePlay, onToggleHeart],
  );

  const emptyComponent = (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No saved videos yet</Text>
      <Text style={styles.emptyDescription}>
        Tap the heart icon on video cards and they will appear here for quick access.
      </Text>
    </View>
  );

  const contentContainerStyle = orderedVideos.length
    ? styles.listContent
    : styles.emptyContent;

  const expiryISO = user?.subscription?.expiry;
  const expiryDate = expiryISO ? new Date(expiryISO) : null;
  const now = new Date();
  const hasValidExpiry = !!expiryDate && !Number.isNaN(expiryDate.getTime());
  const isTrialActive =
    user?.subscription?.plan === 'free' && hasValidExpiry && expiryDate! > now;

  const handleSubscribe = useCallback(() => {
    setIsSubscription(false);
    navigate(routes.SUBSCRIPTIONS);
  }, []);

  return (
    <Container>
      <HeaderWithBack title="Saved Videos" onBack={goBack} />
      <FlatList
        data={orderedVideos}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        style={styles.container}
        contentContainerStyle={contentContainerStyle}
        ListEmptyComponent={emptyComponent}
        showsVerticalScrollIndicator={false}
      />

      <RenderSubscriptionBottomSheet
        isSubscription={isSubscription}
        setIsSubscription={setIsSubscription}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        handleSubscribe={handleSubscribe}
        disableClose={false}
        isTrialActive={isTrialActive}
        canPurchase
        loading={false}
      />
      {/* player fullscreen */}
    </Container>
  );
};

export default SavedVideos;
