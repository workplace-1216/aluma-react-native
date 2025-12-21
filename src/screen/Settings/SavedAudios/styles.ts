import {StyleSheet} from 'react-native';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';
import colors from '../../../assets/colors';
import Fonts from '../../../assets/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: widthToDP('7%'),
    paddingVertical: heightToDP('2.5%'),
    paddingBottom: heightToDP('5%'),
    gap: heightToDP('2%'),
  },
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 28,
    paddingHorizontal: widthToDP('5%'),
    paddingVertical: heightToDP('2.8%'),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: heightToDP('1.5%'),
  },
  titleContainer: {
    flex: 1,
    paddingRight: widthToDP('4%'),
  },
  title: {
    fontFamily: Fonts.FigtreeBold,
    fontSize: heightToDP('2.3%'),
    color: colors.WHITE,
    marginBottom: heightToDP('0.5%'),
  },
  frequencyValue: {
    fontFamily: Fonts.FigtreeSemi,
    fontSize: heightToDP('1.7%'),
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.4,
  },
  description: {
    fontFamily: Fonts.Figtree,
    fontSize: heightToDP('1.85%'),
    lineHeight: heightToDP('2.7%'),
    color: 'rgba(255, 255, 255, 0.78)',
  },
  footer: {
    marginTop: heightToDP('2.4%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  playButtonText: {
    fontFamily: Fonts.FigtreeSemi,
    fontSize: heightToDP('1.75%'),
    color: colors.WHITE,
    marginLeft: 10,
  },
  metaText: {
    fontFamily: Fonts.Figtree,
    fontSize: heightToDP('1.6%'),
    color: 'rgba(255, 255, 255, 0.6)',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: widthToDP('12%'),
  },
  emptyTitle: {
    fontFamily: Fonts.FigtreeSemi,
    fontSize: heightToDP('2.4%'),
    color: colors.WHITE,
    textAlign: 'center',
    marginBottom: heightToDP('1.2%'),
  },
  emptyDescription: {
    fontFamily: Fonts.Figtree,
    fontSize: heightToDP('1.8%'),
    lineHeight: heightToDP('2.6%'),
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: widthToDP('10%'),
  },
});
