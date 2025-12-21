import React from 'react';
import {View, ActivityIndicator, Image, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import images from '../../../assets/images';
import {BRAND_GRADIENT, BRAND_LOGO_SIZE} from '../../../theme/branding';

const AppLoadingScreen: React.FC = () => {
  return (
    <LinearGradient
      colors={BRAND_GRADIENT as string[]}
      style={styles.container}>
      <View style={styles.content}>
        <Image
          source={images.Logo}
          style={styles.logo}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  logo: {
    width: BRAND_LOGO_SIZE.width,
    height: BRAND_LOGO_SIZE.height,
  },
});

export default AppLoadingScreen;
