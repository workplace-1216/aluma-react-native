import {Dimensions, StyleSheet} from 'react-native';
import colors from '../../../assets/colors';
import Fonts from '../../../assets/fonts';
import responsiveUtils from '../../../utils/responsiveUtils';
const CARD_WIDTH = Dimensions.get('window').width / 2 - 40;
export const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    aspectRatio: 3.5 / 4,
    borderRadius: 37,
    backgroundColor: colors.WHITE,
    margin: 10,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: colors.WHITE,
  },
  imageWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: -1,
  },
  titleView: {
    height: '35%',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: colors.WHITE,
  },
   title: {
    fontFamily: Fonts.FigtreeSemi,
    color: colors.WHITE,
    fontSize: 18,
    textAlign: 'center',
  },
  removeBtn: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  removeText: {
    color: colors.WHITE,
    fontSize: responsiveUtils.relativeFontSize(40),
    lineHeight: 60,
    fontFamily: Fonts.FigtreeLight,
  },
   cardBgImage: {
    ...StyleSheet.absoluteFillObject,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  centerContent: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});
