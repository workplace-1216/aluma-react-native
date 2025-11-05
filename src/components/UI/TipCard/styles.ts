import {StyleSheet} from 'react-native';
import colors from '../../../assets/colors';
import Fonts from '../../../assets/fonts';
import {heightToDP, heightToFonts} from 'react-native-responsive-screens';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.BLACK_20,
    padding: 20,
    borderRadius: 37,
    marginBottom: 20,
    width: '90%',
  },
  title: {
    fontSize: heightToFonts(2),
    fontWeight: '700',
    fontFamily: Fonts.FigtreeSemi,
    color: colors.WHITE,
    marginBottom: heightToDP('1%'),
  },
  content: {
    fontSize: heightToFonts(1.5),

    color: colors.WHITE,
    fontFamily: Fonts.FigtreeMedium,
  },
});
