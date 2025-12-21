import {StyleSheet} from 'react-native';
import {widthToDP} from 'react-native-responsive-screens';

export const styles = StyleSheet.create({
  backButtonWrapper: {
    paddingLeft: widthToDP('2%'),
    height: widthToDP('18.481%'),
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: widthToDP('6%'),
  },
});
