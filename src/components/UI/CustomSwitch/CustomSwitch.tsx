import React from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import styles from './styles';

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  activeTrackColor?: string;
  inactiveTrackColor?: string;
  activeThumbColor?: string;
  inactiveThumbColor?: string;
  isLoading?: boolean;
  loadingColor?: string;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  value,
  onValueChange,
  activeTrackColor = '#81b0ff',
  inactiveTrackColor = '#767577',
  activeThumbColor = '#f4f3f4',
  inactiveThumbColor = '#f4f3f4',
  isLoading = false,
  loadingColor = '#ffffff',
}) => {
  const thumbPosition = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(thumbPosition, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value, thumbPosition]);

  const translateX = thumbPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 27],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => !isLoading && onValueChange(!value)}
      style={styles.container}
      disabled={isLoading}>
      <View
        style={[
          styles.track,
          {
            backgroundColor: value ? activeTrackColor : inactiveTrackColor,
          },
        ]}>
        <Animated.View
          style={[
            styles.thumb,
            {
              backgroundColor: value ? activeThumbColor : inactiveThumbColor,
              transform: [{translateX}],
            },
          ]}>
          {isLoading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color={loadingColor} />
            </View>
          )}
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

export default CustomSwitch;
