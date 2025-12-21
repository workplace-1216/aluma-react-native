import { Dimensions, Platform } from 'react-native';

export const isSmallAppleScreen =
  Platform.OS === 'ios' && Dimensions.get('window').height <= 667;
