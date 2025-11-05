import { StyleSheet } from 'react-native';
import colors from '../../../assets/colors';
import Fonts from '../../../assets/fonts';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { heightToFonts } from 'react-native-responsive-screens';

export const styles = StyleSheet.create({
  container: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  sectionLeft: {
    alignItems: 'flex-start',
    width: widthPercentageToDP('25%'),
  },
  sectionCenter: {
    alignItems: 'center',
    width: widthPercentageToDP('25%'),
  },
  sectionRight: {
    alignItems: 'flex-end',
    width: widthPercentageToDP('25%'),
  },
  contentCenter: {
    alignItems: 'center',
  },
  quote: {
    fontSize: heightToFonts(1.4),
    color: colors.WHITE,
    fontWeight: 'bold',
    textAlign: 'left',
    fontFamily: Fonts.FigtreeSemi,
    // width: widthPercentageToDP('20%'),
  },
  number: {
    fontSize: heightToFonts(2.3),
    fontWeight: 'bold',
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeSemi,
  },
  label: {
    fontSize: heightToFonts(1.5),
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeSemi,
  },
});
