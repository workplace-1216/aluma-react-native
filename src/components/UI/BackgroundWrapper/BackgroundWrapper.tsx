import React, {ReactNode} from 'react';
import {View} from 'react-native';
import FastImage, {Source} from 'react-native-fast-image';
import styles from './styles';
import images from '../../../assets/images';
import {FREQUENCY} from '../../../redux/slice/moodSlice';

interface BackgroundWrapperProps {
  children: ReactNode;
  night: boolean;
  currentFrequency?: FREQUENCY;
}

type FastImageSource = number | Source;

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({
  children,
  night,
  currentFrequency,
}) => {
  const hasValidUrl =
    !!currentFrequency?.photo_url &&
    /^https?:\/\/.+/i.test(currentFrequency.photo_url);
  const imageSource: FastImageSource = night
    ? {
        uri: currentFrequency?.background_image_night,
        priority: FastImage.priority.high,
        cache: FastImage.cacheControl.web,
      }
    : hasValidUrl
    ? {
        uri: currentFrequency!.photo_url!,
        priority: FastImage.priority.high,
        cache: FastImage.cacheControl.immutable,
      }
    : images.day_default_background;

  return (
    <FastImage
      source={imageSource}
      style={styles.container}
      resizeMode={FastImage.resizeMode.cover}>
      <View style={styles.overlay}>{children}</View>
    </FastImage>
  );
};

export default BackgroundWrapper;
