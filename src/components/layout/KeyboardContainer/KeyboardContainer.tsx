import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View, ViewStyle} from 'react-native';
import {styles} from './styles';
import LinearGradient from 'react-native-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type KeyboardContainerProps = {
  children?: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  scrollEnabled?: boolean;
};

const KeyboardContainer = ({
  children,
  style,
  contentContainerStyle,
  scrollEnabled = true,
}: KeyboardContainerProps) => {
  return (
    <LinearGradient
      colors={['#1E2746', '#113D56', '#045466']}
      style={styles.mainContainer}>
      <SafeAreaView edges={['top', 'bottom']} style={[styles.container, style]}>
        {scrollEnabled ? (
          <KeyboardAwareScrollView
            style={styles.mainContainer}
            contentContainerStyle={contentContainerStyle}
            keyboardShouldPersistTaps="handled">
            {children}
          </KeyboardAwareScrollView>
        ) : (
          <View style={[styles.mainContainer, contentContainerStyle]}>
            {children}
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default KeyboardContainer;
