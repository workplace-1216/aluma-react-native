import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import styles from './styles';

interface ButtonProps {
  title: string;
  variant?: 'filled' | 'outline';
  onPress?: () => void;
  width?: number;
  disabled?: boolean;
}

const CustomButton: React.FC<ButtonProps> = ({
  title,
  variant = 'filled',
  onPress,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'filled' ? styles.filled : styles.outline,
        disabled && {opacity: 0.5},
      ]}
      onPress={onPress}
      disabled={disabled}>
      <Text
        style={[
          styles.text,
          variant === 'outline' && styles.outlineText,
          disabled && {color: '#aaa'}, // Optional: light text when disabled
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
