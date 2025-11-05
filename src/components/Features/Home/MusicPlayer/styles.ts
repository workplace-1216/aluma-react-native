// components/Features/Home/MusicPlayer/styles.ts
import { StyleSheet } from 'react-native';
import colors from '../../../../assets/colors';
import { heightToDP, widthToDP } from 'react-native-responsive-screens';

export const styles = StyleSheet.create({
  buttonView: {
    width: widthToDP('85%'),
    alignSelf: 'center',
  },
  timerButton: {
    marginTop: widthToDP(-1.5),
    height: heightToDP(4.2),
    width: heightToDP(4.2),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE_50,
    borderRadius: 100,
    alignSelf: 'flex-end',
  },
});
