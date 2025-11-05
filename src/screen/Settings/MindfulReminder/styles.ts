import { StyleSheet } from 'react-native';
import { heightToDP, widthToDP } from 'react-native-responsive-screens';
import colors from '../../../assets/colors';
import Fonts from '../../../assets/fonts';
import responsiveUtils from '../../../utils/responsiveUtils';

const ITEM_HEIGHT = 50;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  content: {
    flex: 1,
    paddingTop: heightToDP(2.4),
    gap: widthToDP(3),
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: heightToDP('2%'),
    paddingHorizontal: widthToDP('15%'),
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  toggleText: {
    fontSize: responsiveUtils.relativeFontSize(19),
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeSemi,
  },
  reminderSettings: {
    marginTop: widthToDP(15),
    alignItems: 'center',
  },
  reminderLabel: {
    fontSize: responsiveUtils.relativeFontSize(21),
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeSemi,
    marginBottom: heightToDP('3%'),
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: widthToDP(3),
    paddingVertical: widthToDP(1),
    paddingHorizontal: widthToDP(4),
    marginBottom: heightToDP('2%'),
  },
  selectorText: {
    fontSize: responsiveUtils.relativeFontSize(21),
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeBold,
    marginRight: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  newModalContent: {
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  newHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  newCancelButton: {
    color: colors.WHITE,
    fontSize: responsiveUtils.relativeFontSize(18),
    fontFamily: Fonts.FigtreeMedium,
  },
  newSaveButton: {
    color: colors.WHITE,
    fontSize: responsiveUtils.relativeFontSize(18),
    fontFamily: Fonts.FigtreeBold,
  },
  newOptionsContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  newOptionItem: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginVertical: 4,
    borderRadius: 8,
  },
  newSelectedOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  newOptionText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: responsiveUtils.relativeFontSize(20),
    fontFamily: Fonts.Figtree,
    textAlign: 'center',
  },
  newSelectedOptionText: {
    color: colors.WHITE,
    fontFamily: Fonts.FigtreeSemi,
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelText: {
    fontSize: 20,
    color: '#999',
  },
  selectedText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#000',
  },
});
