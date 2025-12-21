import { StyleSheet } from 'react-native';
import colors from '../../../assets/colors';
import { heightToDP, widthToDP } from 'react-native-responsive-screens';
import Fonts from '../../../assets/fonts';
import responsiveUtils from '../../../utils/responsiveUtils';

export const styles = StyleSheet.create({
    planCard: {
    //flex: 1,
     width: widthToDP('44%'),
    height: heightToDP('22%'),
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
    fontFamily: Fonts.FigtreeLight,         // Figtree Light
    fontSize: responsiveUtils.relativeFontSize(21),
    lineHeight: responsiveUtils.relativeFontSize(21), // 100%
    letterSpacing: -0.63,                   // -3% de 21
    textAlign: 'center',
    // Figma é bem "leve", então tira o 600
     fontWeight: '600', // opcional, só se o fontFamily não cuidar do weight
    marginBottom: 2,                        // pequeno espaço antes do preço/texto
  },
  planPrice: {
    fontFamily: Fonts.FigtreeLight,
    fontSize: responsiveUtils.relativeFontSize(21),
    textAlign: 'center',
    marginBottom: widthToDP(7),
    fontWeight: '600',
  },
  planPriceWithSecondary: {
    marginBottom: widthToDP(1),
  },
  planPriceSecondary: {
    fontFamily: Fonts.FigtreeLight,
    fontSize: responsiveUtils.relativeFontSize(16),
    textAlign: 'center',
    marginBottom: widthToDP(3),
    fontWeight: '300',
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
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: widthToDP(2),
  },
    featureText: {
    fontFamily: Fonts.FigtreeLight,
    fontSize: responsiveUtils.relativeFontSize(14),
    lineHeight: responsiveUtils.relativeFontSize(14.76), // 123%
    letterSpacing: -0.36,         // -3% de 12
    textAlign: 'center',
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
    width: '100%',
    marginBottom: responsiveUtils.relativeHeight(2),
  },
  globalFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: widthToDP(1),
  },
  globalFeatureText: {
    fontFamily: Fonts.FigtreeLight,
    fontSize: responsiveUtils.relativeFontSize(19),
    color: colors.WHITE,
    lineHeight: responsiveUtils.relativeFontSize(32.11),
    letterSpacing: 0.19,
    textAlign: 'center',
    fontWeight: '300',
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
  fontFamily: Fonts.FigtreeMedium,                       // Figtree Medium
  fontSize: responsiveUtils.relativeFontSize(21),        // 21px
  lineHeight: responsiveUtils.relativeFontSize(21),      // 100%
  letterSpacing: -0.63,                                  // -3% de 21
  textAlign: 'center',                                   // igual Figma
  // opcional: se o Medium já vem do fontFamily, pode nem precisar disso
  // fontWeight: '500',
},
  trialNote: {
    fontFamily: Fonts.FigtreeLight,
    fontSize: responsiveUtils.relativeFontSize(16),
    lineHeight: responsiveUtils.relativeFontSize(20),
    color: colors.WHITE,
    textAlign: 'center',
    opacity: 0.8,
    marginTop: widthToDP(3),
    fontWeight: '300',
    width: widthToDP('80%'),
    alignSelf: 'center',
  },
});
