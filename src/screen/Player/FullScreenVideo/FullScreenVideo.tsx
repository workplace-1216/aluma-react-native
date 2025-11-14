import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  BackHandler,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Video, {VideoRef} from 'react-native-video';
import colors from '../../../assets/colors';
import routes from '../../../constants/routes';
import {navigate} from '../../../navigation/AppNavigator';

type RouteParams = {
  videoUrl: string;
  poster?: string;
  title?: string;
};

const FullScreenVideo: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = (route.params || {}) as RouteParams;
  const videoRef = useRef<VideoRef>(null);
  const [loading, setLoading] = useState(true);

  const closeScreen = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigate(routes.HOME);
    }
  }, [navigation]);

  useEffect(() => {
    if (!params.videoUrl) {
      closeScreen();
    }
  }, [closeScreen, params.videoUrl]);

  useEffect(() => {
    StatusBar.setHidden(true, 'fade');

    const backSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        closeScreen();
        return true;
      },
    );

    const fullscreenTimer = setTimeout(() => {
      if (Platform.OS === 'ios') {
        videoRef.current?.presentFullscreenPlayer?.();
      }
    }, 100);

    return () => {
      clearTimeout(fullscreenTimer);
      if (Platform.OS === 'ios') {
        videoRef.current?.dismissFullscreenPlayer?.();
      }
      backSubscription.remove();
      StatusBar.setHidden(false, 'fade');
    };
  }, [closeScreen]);

  const handleFullscreenDismiss = () => {
    closeScreen();
  };

  if (!params.videoUrl) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{uri: params.videoUrl}}
        style={styles.video}
        controls
        resizeMode="contain"
        onLoadStart={() => setLoading(true)}
        onBuffer={({isBuffering}) => setLoading(isBuffering)}
        onLoad={() => setLoading(false)}
        onFullscreenPlayerDidDismiss={handleFullscreenDismiss}
        onError={error =>
          console.warn('FullScreenVideo::playback error', error?.errorString)
        }
      />
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.WHITE} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLACK,
  },
  video: {
    flex: 1,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.BLACK,
  },
});

export default FullScreenVideo;
