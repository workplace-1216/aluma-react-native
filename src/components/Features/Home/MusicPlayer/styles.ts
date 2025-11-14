// components/Features/Home/MusicPlayer/styles.ts
import { StyleSheet } from 'react-native';
import colors from '../../../../assets/colors';
import { heightToDP, widthToDP } from 'react-native-responsive-screens';

export const styles = StyleSheet.create({
  footerRow: {
    width: widthToDP('85%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: widthToDP(2),
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitle: {
    color: colors.WHITE,
    fontWeight: '600',
    fontSize: widthToDP(4),
  },
  exerciseMeta: {
    color: colors.WHITE,
    fontSize: widthToDP(4),
    marginTop: 2,
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
