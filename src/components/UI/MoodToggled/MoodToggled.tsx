import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgMoon } from '../../../assets/svg';
import { styles } from './styles';
import { heightToDP, widthToDP } from 'react-native-responsive-screens';

interface ToggleButtonProps {
  onToggle?: (state: boolean) => void;
  initialState?: boolean;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  onToggle,
  initialState = false,
}) => {
  const [isOn, setIsOn] = useState<boolean>(initialState);
  const translateX = useRef(new Animated.Value(initialState ? 25 : 0)).current;
  const moonOpacity = useRef(new Animated.Value(initialState ? 1 : 0)).current;

  // Update internal state when initialState prop changes
  useEffect(() => {
    setIsOn(initialState);
  }, [initialState]);

  useEffect(() => {
    // Animate the toggle movement
    Animated.timing(translateX, {
      toValue: isOn ? 25 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Animate the moon icon fade-in and fade-out
    Animated.timing(moonOpacity, {
      toValue: isOn ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOn, translateX, moonOpacity]);

  const handlePress = () => {
    setIsOn(prev => {
      const newState = !prev;
      if (onToggle) {onToggle(newState);}
      return newState;
    });
  };

  return (
    <TouchableOpacity
      style={[styles.container, isOn ? styles.on : styles.off]}
      activeOpacity={0.7}
      onPress={handlePress}>
      <Animated.View
        style={[styles.circleWrapper, { transform: [{ translateX }] }]}>
        <Animated.View style={{ opacity: moonOpacity }}>
          {isOn ? (
            <LinearGradient
              colors={['#1C1038', '#572772', '#AA48C3']}
              style={styles.circle}>
              <SvgMoon
                height={heightToDP('3.648%')}
                width={widthToDP('5.81%')}
              />
            </LinearGradient>
          ) : (
            <View style={[styles.circle, { backgroundColor: 'white' }]} />
          )}
        </Animated.View>
      </Animated.View>

      {!isOn && (
        <Animated.View
          style={{
            position: 'absolute',
            right: 5,
            opacity: moonOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0], // Hide when toggled on
            }),
          }}>
          <SvgMoon />
        </Animated.View>
      )}
    </TouchableOpacity>
  );
};

export default ToggleButton;
