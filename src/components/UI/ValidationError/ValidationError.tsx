import { Image, Text, View } from 'react-native';
import React from 'react';
import { styles } from './styles';
import { SvgError } from '../../../assets/svg';


type ValidationErrorProps = {
  error: string | undefined;
};
const ValidationError = ({ error }: ValidationErrorProps) => {
  return (
    error && (
      <View style={styles.container}>
        <SvgError />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  );
};

export default ValidationError;
