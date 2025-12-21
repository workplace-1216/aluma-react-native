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
  content: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: widthToDP('8%'),
    paddingVertical: heightToDP('3%'),
  },
  inputContainer: {
    marginBottom: heightToDP('2.5%'),
  },
  inputLabel: {
    fontSize: responsiveUtils.relativeFontSize(19),
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeSemi,
    marginBottom: heightToDP('1%'),
  },
  input: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingHorizontal: widthToDP('4%'),
    paddingVertical: heightToDP('1.5%'),
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeLight,
    fontSize: responsiveUtils.relativeFontSize(20),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  emailInput: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingHorizontal: widthToDP('4%'),
    paddingVertical: heightToDP('1.5%'),
    color: 'rgba(255, 255, 255, 0.35)',
    fontFamily: Fonts.FigtreeLight,
    fontSize: responsiveUtils.relativeFontSize(20),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputError: {
    borderWidth: 1,
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontFamily: Fonts.FigtreeLight,
    fontSize: responsiveUtils.relativeFontSize(15),
    marginTop: heightToDP('0.5%'),
  },
  submitButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 47,
    paddingVertical: 10,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.WHITE,
    marginTop: heightToDP('2%'),
  },
  submitButtonText: {
    fontFamily: Fonts.FigtreeSemi,
    color: colors.WHITE,
    fontSize: responsiveUtils.relativeFontSize(21),
    marginRight: 9,
  },
});
