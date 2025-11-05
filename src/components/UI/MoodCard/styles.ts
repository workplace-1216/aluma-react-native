import {Dimensions, StyleSheet} from 'react-native';
import Fonts from '../../../assets/fonts';
import responsiveUtils from '../../../utils/responsiveUtils';
const CARD_WIDTH = Dimensions.get('window').width / 2 - 40;
export const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'transparent',
    borderRadius: 37,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: CARD_WIDTH / 9 ,
    paddingHorizontal: CARD_WIDTH / 11,
    marginTop: 20,
    minHeight: CARD_WIDTH * 1.14,
  },
  titleView: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontFamily: Fonts.FigtreeSemi,
    fontSize: responsiveUtils.relativeFontSize(21),
    fontWeight: '600',
    textAlign: 'center',
  },
  circle: {
    width: CARD_WIDTH / 1.8,
    height: CARD_WIDTH / 1.8,
    borderRadius: CARD_WIDTH,
  },
});
