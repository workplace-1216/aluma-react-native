import React from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './styles';
import LinearGradient from 'react-native-linear-gradient';

type containerType = {
  children?: React.ReactNode;
  style?: object;
};

const Container = ({children, style}: containerType) => {
  return (
    <LinearGradient
      colors={['#1E2746', '#113D56', '#045466']}
      style={styles.mainContainer}>
      <SafeAreaView edges={['top', 'bottom']} style={[styles.container, style]}>
        <View style={styles.innerContainer}>{children}</View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Container;
