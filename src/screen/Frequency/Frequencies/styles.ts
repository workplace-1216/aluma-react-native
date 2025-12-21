import {Dimensions, StyleSheet} from 'react-native';
import colors from '../../../assets/colors';
import Fonts from '../../../assets/fonts';
import responsiveUtils from '../../../utils/responsiveUtils';
import {widthToDP} from 'react-native-responsive-screens';

const CARD_WIDTH = Dimensions.get('window').width / 2 - 40;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,

  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,

  },
  backButton: {
    alignSelf: 'flex-start',
    paddingLeft: '6%',
    zIndex: 2,
  },

  header: {
    fontFamily: Fonts.FigtreeSemi,
    fontSize: responsiveUtils.relativeFontSize(23),
    color: colors.WHITE,
    textAlign: 'center',
    position: 'absolute',
    alignSelf: 'center',
    width: '100%',
  },
  borderBottomLine: {
    width: '100%',
    borderBottomColor: colors.WHITE,
    opacity: 0.35,
    borderBottomWidth: 1,
  },
  contentContainerStyle: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal:30,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  flatlistView: {
    alignContent: 'space-between',
  },
  addCard: {
    width: CARD_WIDTH,
    aspectRatio: 3.5 / 4,
    borderRadius: 37,
    backgroundColor: 'transparent',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.WHITE,
    opacity: 0.5,
  },
  addText: {
    fontFamily: Fonts.FigtreeSemi,
    fontSize: responsiveUtils.relativeFontSize(23),
    color: colors.WHITE,
    marginBottom: widthToDP(4),
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
    paddingHorizontal: 47,
    paddingVertical: 6,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.WHITE,
  },
  removeFrequencyButton: {
    alignSelf: 'center',
    paddingTop: 10,
    paddingBottom: 5,
  },
  footerText: {
    fontFamily: Fonts.FigtreeSemi,
    color: colors.WHITE,
    fontSize: responsiveUtils.relativeFontSize(21),
    marginRight: 9,
  },
  footerEndText: {
    fontFamily: Fonts.FigtreeSemi,
    color: colors.WHITE,
    fontSize: responsiveUtils.relativeFontSize(21),
    marginBottom: '5%',
  },
});
