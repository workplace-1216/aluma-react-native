import React, {ReactNode, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage, {Source} from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import images from '../../../assets/images';
import {FREQUENCY} from '../../../redux/slice/moodSlice';

interface BackgroundWrapperProps {
  children: ReactNode;
  night: boolean;
  currentFrequency?: FREQUENCY;
}

type FastImageSource = number | Source;

const isRemoteUrl = (value?: string | null) =>
  typeof value === 'string' && /^https?:\/\//i.test(value);

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({
  children,
  night,
  currentFrequency,
}) => {
  const hasRemotePhoto =
    !!currentFrequency?.photo_url && isRemoteUrl(currentFrequency.photo_url);
  const isNightRemote =
    night && !!currentFrequency?.background_image_night && isRemoteUrl(currentFrequency.background_image_night);

  const imageSource: FastImageSource = isNightRemote
    ? {
        uri: currentFrequency?.background_image_night,
        priority: FastImage.priority.high,
        cache: FastImage.cacheControl.web,
      }
    : hasRemotePhoto
    ? {
        uri: currentFrequency!.photo_url!,
        priority: FastImage.priority.high,
        cache: FastImage.cacheControl.immutable,
      }
    : images.day_default_background;

  const shouldFade = typeof imageSource !== 'number';
  const [isLoaded, setIsLoaded] = useState(!shouldFade);

  useEffect(() => {
    setIsLoaded(!shouldFade);
  }, [shouldFade]);

  return (
    <View style={styles.container}>
      <LinearGradient
        pointerEvents="none"
        colors={['#1E2746', '#113D56', '#045466']}
        style={StyleSheet.absoluteFillObject}
      />

      <FastImage
        pointerEvents="none"
        source={imageSource}
        style={[
          StyleSheet.absoluteFillObject,
          styles.backgroundImage,
          {opacity: isLoaded ? 1 : 0},
        ]}
        resizeMode={FastImage.resizeMode.cover}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(false)}
      />

      <View style={styles.content}>{children}</View>
    </View>
  );
};

export default BackgroundWrapper;
