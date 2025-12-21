import React, {useState} from 'react';
import {View, TextInput, TextInputProps} from 'react-native';
import styles from './styles'; // Import styles
import {SvgProps} from 'react-native-svg';
import colors from '../../../assets/colors';

interface CustomTextInputProps extends TextInputProps {
  Icon?: React.FC<SvgProps>; // Expecting an SVG component
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({Icon, ...props}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.inputContainer, isFocused && styles.focused]}>
      {Icon && (
        <Icon
          width={24}
          height={24}
          style={[styles.icon, !isFocused && {opacity: 0.6}]}
        />
      )}
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.disableBorder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
};

export default CustomTextInput;
