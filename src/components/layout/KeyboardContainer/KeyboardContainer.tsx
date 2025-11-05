import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './styles';
import LinearGradient from 'react-native-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type containerType = {
  children?: React.ReactNode;
  style?: object;
};

const KeyboardContainer = ({children, style}: containerType) => {
  return (
    <LinearGradient
      colors={['#1E2746', '#113D56', '#045466']}
      style={styles.mainContainer}>
      <SafeAreaView edges={['top', 'bottom']} style={[styles.container, style]}>
        <KeyboardAwareScrollView style={styles.mainContainer}>
          {children}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default KeyboardContainer;
