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
  section: {
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.35)',
    paddingVertical: heightToDP('2.5%'),
    paddingHorizontal: widthToDP('15%'),
  },
  infoItem: {
    marginBottom: heightToDP('1.5%'),
  },
  infoLabel: {
    fontSize: responsiveUtils.relativeFontSize(19),
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeSemi,
  },
  infoValue: {
    fontSize: responsiveUtils.relativeFontSize(19),
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: Fonts.FigtreeSemi,
  },
  editButton: {
    fontSize: responsiveUtils.relativeFontSize(19),
    color: colors.GOLD,
    fontFamily: Fonts.FigtreeSemi,
    marginTop: heightToDP('1%'),
  },
  deleteSection: {
    paddingVertical: heightToDP('2.5%'),
    paddingHorizontal: widthToDP('15%'),
  },
  deleteLabel: {
    fontSize: responsiveUtils.relativeFontSize(19),
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: Fonts.FigtreeSemi,
    marginBottom: heightToDP('0.5%'),
  },
  deleteButton: {
    fontSize: responsiveUtils.relativeFontSize(19),
    color: colors.GOLD,
    fontFamily: Fonts.FigtreeSemi,
    marginTop: heightToDP('1%'),
  },
});
