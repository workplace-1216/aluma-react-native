import { StyleSheet } from 'react-native';
import colors from '../../../assets/colors';
import { heightToDP, widthToDP } from 'react-native-responsive-screens';
import Fonts from '../../../assets/fonts';
import responsiveUtils from '../../../utils/responsiveUtils';

export const styles = StyleSheet.create({
    planCard: {
    // remova o flex: 1
    width: 184,
    height: 212,
    paddingRight: widthToDP(3),
    paddingLeft: widthToDP(3.5),
    paddingTop: widthToDP(6),
    paddingBottom: widthToDP(6),
    borderRadius: 37,
    borderWidth: 3,
    borderColor: colors.WHITE,
  },
  selectedCard: {
    backgroundColor: colors.WHITE_08,
  },
  unselectedCard: {
    backgroundColor: 'transparent',
  },
  planTitle: {
    fontFamily: Fonts.FigtreeSemi,
    fontSize: responsiveUtils.relativeFontSize(21),
    textAlign: 'center',
    fontWeight: '600',
  },
  planPrice: {
    fontFamily: Fonts.FigtreeSemi, // Changed from Light to Semi for prominence
    fontSize: responsiveUtils.relativeFontSize(28), // Increased from 21 to 28 for prominence
    textAlign: 'center',
    marginBottom: widthToDP(3), // Reduced margin to bring price closer to trial info
    fontWeight: '700', // Increased from 300 to 700 (bold) for maximum prominence
  },
  selectedText: {
    color: colors.BLACK_10,
    textShadowColor: colors.WHITE,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  unselectedText: {
    color: colors.WHITE,
  },
  featuresContainer: {
    flex: 1,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    width: 2,
    height: 2,
    borderRadius: 2,
    marginTop: 6,
    marginRight: 6,
  },
  featureText: {
    fontFamily: Fonts.FigtreeLight,
    fontSize: responsiveUtils.relativeFontSize(12), // Reduced from 14 to 12 to be subordinate
    flex: 1,
    opacity: 0.85, // Added opacity to make it less prominent
  },
  selectedFeatureText: {
    color: colors.BLACK_10,
    textShadowColor: colors.WHITE,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  unselectedFeatureText: {
    color: colors.WHITE,
  },
  cardsContainer: {
    flexDirection: 'row',
    width: widthToDP('80%'), // 80% da largura da tela
    alignSelf: 'center',     // centraliza o container
    justifyContent: 'center',// centraliza os itens dentro
    alignItems: 'center',
    gap: widthToDP(2),       // se seu RN suportar gap; se não, use margin nos cards
    marginBottom: responsiveUtils.relativeHeight(3),
  },
  globalFeatures: {
    flex: 1,
    width: '100%',
    marginBottom: responsiveUtils.relativeHeight(3),
  },
  globalFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: widthToDP(1),
  },
  globalFeatureText: {
    fontFamily: Fonts.FigtreeLight,
    fontSize: responsiveUtils.relativeFontSize(21),
    color: colors.WHITE,
    lineHeight: heightToDP('2.538%'),
    textAlign: 'center',
  },
  subscribeButton: {
    backgroundColor: colors.WHITE,
    borderRadius: 30,
    paddingVertical: heightToDP('2%'),
    paddingHorizontal: widthToDP('10%'),
    width: widthToDP('80%'),
    alignItems: 'center',
    alignSelf: 'center',
  },
  subscribeButtonText: {
    color: '#123C54',
    fontFamily: Fonts.FigtreeMedium,
    fontSize: responsiveUtils.relativeFontSize(21),
  },
});
