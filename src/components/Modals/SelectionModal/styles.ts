import {Dimensions, StyleSheet} from 'react-native';
import Fonts from '../../../assets/fonts';
import colors from '../../../assets/colors';
import responsiveUtils from '../../../utils/responsiveUtils';
const screen = Dimensions.get('screen');
export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: screen.height,
    width: screen.width,
    backgroundColor: 'pink',
    zIndex: 999,
  },
  modalOverlayMain: {
    height: screen.height,
    width: screen.width,
  },
  modalOverlay: {
    height: screen.height,
    width: screen.width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    marginTop: responsiveUtils.relativeHeight(5),
    width:'65%',
    fontFamily: Fonts.FigtreeSemi,
    backgroundColor: 'rgba(246, 246, 246, 0.8)',
    borderRadius: 37,
    overflow: 'hidden',
  },
  headerView:{
    paddingTop: 24,
    borderTopLeftRadius: 37,
    borderTopRightRadius: 37,
    backgroundColor: 'rgba(17, 25, 43, 0.7)',
    flexDirection:'row',
    justifyContent:'space-between',
  },
  closeText:{
   fontFamily: Fonts.FigtreeMedium,
   fontSize: responsiveUtils.relativeFontSize(23),
   paddingRight: 24,
   color:colors.WHITE,
  },
  scrollView: {
    maxHeight: 210,
  },
  modalTitle: {
    fontFamily: Fonts.FigtreeSemi,
    fontSize: responsiveUtils.relativeFontSize(22),
    color: colors.WHITE,
    paddingLeft: 24,
    marginBottom: 24,
  },
  settingButton: {
    // backgroundColor: 'rgba(246, 246, 246, 0.8)',
    padding: 14,
    paddingLeft: 24,
    borderBottomWidth: 1,
    borderColor: colors.WHITE,
  },
  settingButtonLast: {
    // backgroundColor: 'rgba(246, 246, 246, 0.8)',
    padding: 14,
    paddingLeft: 24,
  },
  settingText: {
    fontFamily: 'Inter',
    color: colors.WHITE,
    fontSize: responsiveUtils.relativeFontSize(22),
  },
});
