import {StyleSheet} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import Fonts from '../../../assets/fonts';
import responsiveUtils from '../../../utils/responsiveUtils';

export const styles = StyleSheet.create({
  successContainer: {
    maxWidth: widthPercentageToDP('80%'),
    backgroundColor: '#E6F6E8',
    borderRadius: 6,
    padding: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  errorContainer: {
    maxWidth: widthPercentageToDP('80%'),
    backgroundColor: '#FFF4F3',
    borderRadius: 6,
    padding: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  infoContainer: {
    maxWidth: widthPercentageToDP('80%'),
    backgroundColor: '#2D9CDB',
    borderRadius: 6,
    padding: 10,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  message: {
    fontSize: responsiveUtils.relativeFontSize(15),
    fontFamily: Fonts.Figtree,
    fontWeight: '500',
    paddingVertical: 5,
    lineHeight: 20,
    paddingHorizontal: 8,
    color: '#098345',
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: responsiveUtils.relativeFontSize(15),
    fontFamily: Fonts.Figtree,
    fontWeight: '500',
    paddingVertical: 5,
    lineHeight: 20,
    paddingHorizontal: 8,
    color: '#FF0000',
    textAlign: 'center',
  },
  infoMessage: {
    fontSize: responsiveUtils.relativeFontSize(14),
    fontFamily: 'System',
    fontWeight: '500',
    paddingVertical: 6,
    paddingHorizontal: 10,
    lineHeight: 20,
    color: '#ffffff',
    textAlign: 'center',
  },
});
