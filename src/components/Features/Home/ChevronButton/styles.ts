import { StyleSheet } from 'react-native';
import responsiveUtils from '../../../../utils/responsiveUtils';
import { widthToDP } from 'react-native-responsive-screens';

const SIZE = 7.3;
const RATIO = 2.369;

export const styles = StyleSheet.create({
  safeView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevButtonStyle: {
    padding: widthToDP(2),
  },
  chevronStyle: {
    height: responsiveUtils.relativeWidth(SIZE),
    width: responsiveUtils.relativeWidth(SIZE * RATIO),
  },
});
