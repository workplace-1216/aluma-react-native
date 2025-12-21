// components/Features/Home/MusicPlayer/styles.ts
import { StyleSheet } from 'react-native';
import colors from '../../../../assets/colors';
import { heightToDP, widthToDP } from 'react-native-responsive-screens';
import Fonts from '../../../../assets/fonts';
import responsiveUtils from '../../../../utils/responsiveUtils';

export const styles = StyleSheet.create({
  footerRow: {
    width: widthToDP('75.7%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: widthToDP(2),
    marginBottom: widthToDP(3),
  },
  exerciseInfo: {
    flex: 1,
    width: widthToDP(56.05),
    height: heightToDP(3.86),
  },
  exerciseTitle: {
    color: colors.WHITE,
    fontWeight: '600',
    fontFamily: Fonts.FigtreeLight,
    fontSize: responsiveUtils.relativeFontSize(21),
    letterSpacing:0.5,
  },
  exerciseMeta: {
    color: colors.WHITE,
    fontSize: responsiveUtils.relativeFontSize(21),
    marginTop: 2,
    fontWeight: '600',
     letterSpacing:0.5,
     fontFamily: Fonts.FigtreeLight,
  },
  timerButton: {
    height: heightToDP(4.2),
    width: heightToDP(4.2),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE_50,
    borderRadius: 100,
    marginLeft: widthToDP(4),
  },
});
