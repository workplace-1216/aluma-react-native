import {StyleSheet} from 'react-native';
import colors from '../../../assets/colors';
import responsiveUtils from '../../../utils/responsiveUtils';
import Fonts from '../../../assets/fonts';
import {widthToDP} from 'react-native-responsive-screens';

export const styles = StyleSheet.create({
  modalView: {
    flex: 1,
  },
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 37,
    borderTopRightRadius: 37,
  },
  contentContainer: {
    flex: 1,

  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  headerWrapper: {
    flexDirection: 'column',
  },
  headerWrapperWithToggle: {
    paddingBottom: 5,
  },
  headerWrapperWithoutToggle: {
    paddingBottom: 20,
  },
  closeButtonContainer: {
    width: '100%',
    alignItems: 'flex-end',
    paddingTop: 2,
  },
  closeButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  close: {
    fontFamily: Fonts.FigtreeMedium,
    fontSize: responsiveUtils.relativeFontSize(20),
    color: colors.WHITE,
    paddingTop: 10,
    paddingRight: 10,
  },
  title: {
    width: widthToDP('71.53%'),
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeSemi,
    textAlign: 'center',
    fontSize: responsiveUtils.relativeFontSize(21),
  },
  scrollView: {
    flex: 1,
  },
  scrollViewNoGutters: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});
