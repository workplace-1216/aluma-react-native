import {isSmallAppleScreen} from './../../../utils/isSmallAppleScreen';
import {StyleSheet} from 'react-native';
import {widthToDP} from 'react-native-responsive-screens';
import responsiveUtils from '../../../utils/responsiveUtils';

const CHEVRON_PLACEHOLDER_SIZE = 11.3;

export const styles = StyleSheet.create({
  animatedView: {
    flex: 1,
    backgroundColor: '#6E6E6E',
  },
  safeAreaView: {
    flex: 1,
  },
  container: {
    flex: 1,
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: widthToDP(isSmallAppleScreen ? 1 : 4),
  },
  chevronPlaceholder: {
    height: responsiveUtils.relativeWidth(CHEVRON_PLACEHOLDER_SIZE),
    padding: widthToDP(2),
  },
});
