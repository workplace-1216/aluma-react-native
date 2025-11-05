import {StyleSheet} from 'react-native';
import colors from '../../../assets/colors';
import responsiveUtils from '../../../utils/responsiveUtils';
import {widthToDP} from 'react-native-responsive-screens';

export default StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#6C7A89',
    borderRadius: 30,
    paddingHorizontal: 15,
    // paddingVertical: Platform.OS === 'ios' ? 14 : 4,
    width: '100%',
    paddingVertical: widthToDP('3.28%'),
    // height: heightToDP('6.33%'),
  },
  focused: {
    borderColor: colors.WHITE,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: responsiveUtils.relativeFontSize(21),
    color: colors.WHITE,
  },
});
