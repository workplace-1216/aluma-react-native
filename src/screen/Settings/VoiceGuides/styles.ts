import {StyleSheet} from 'react-native';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';
import colors from '../../../assets/colors';
import Fonts from '../../../assets/fonts';
import responsiveUtils from '../../../utils/responsiveUtils';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingLeft: '6%',
    zIndex: 2,
  },
  headerTitle: {
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: widthToDP('15%'),
    paddingVertical: heightToDP('3%'),
    paddingBottom: heightToDP('5%'),
  },
  guideCard: {
    width: widthToDP('85%'),
    alignSelf: 'center',
    borderRadius: 37,
    paddingHorizontal: 33,
    paddingVertical: 24,
    marginBottom: heightToDP('3%'),
    borderWidth: 2,
    borderColor: colors.WHITE,
  },
  lightBackgroundCard: {
    backgroundColor: '#D0D7DD',
  },
  darkBackgroundCard: {
    backgroundColor: 'transparent',
  },
  guideInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightToDP('2%'),
  },
  guideImage: {
    width: 44,
    height: 44,
    borderRadius: widthToDP('100%'),
  },
  guideTextContainer: {
    marginLeft: widthToDP('3%'),
  },
  // Name styles for different backgrounds
  guideNameLight: {
    fontSize: responsiveUtils.relativeFontSize(21),
    fontFamily: Fonts.FigtreeSemi,
    color: colors.WHITE,
  },
  guideNameDark: {
    fontSize: responsiveUtils.relativeFontSize(21),
    fontFamily: Fonts.FigtreeSemi,
    color: '#0A0A0A',
  },
  // Title styles for different backgrounds
  guideTitleLight: {
    fontSize: responsiveUtils.relativeFontSize(15),
    fontFamily: Fonts.Figtree,
    color: colors.WHITE,
  },
  guideTitleDark: {
    fontSize: responsiveUtils.relativeFontSize(15),
    fontFamily: Fonts.Figtree,
    color: '#0A0A0A',
  },
  // Description styles for different backgrounds
  guideDescriptionLight: {
    fontSize: responsiveUtils.relativeFontSize(19),
    fontFamily: Fonts.Figtree,
    color: colors.WHITE,
    lineHeight: heightToDP('2.5%'),
  },
  guideDescriptionDark: {
    fontSize: responsiveUtils.relativeFontSize(19),
    fontFamily: Fonts.Figtree,
    color: '#000000',
    lineHeight: heightToDP('2.5%'),
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: heightToDP('2%'),
    color: colors.WHITE,
    fontSize: responsiveUtils.relativeFontSize(16),
    fontFamily: Fonts.FigtreeMedium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: widthToDP('10%'),
  },
  emptyText: {
    color: colors.WHITE,
    fontSize: responsiveUtils.relativeFontSize(18),
    fontFamily: Fonts.FigtreeMedium,
    textAlign: 'center',
  },
});
