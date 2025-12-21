import {StyleSheet} from 'react-native';
import colors from '../../../assets/colors';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  safeView: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 0,
  },
  modal: {
    backgroundColor: colors.WHITE,
    borderRadius: 20,
    marginHorizontal: 0,
    paddingBottom: 0,
    width: '100%',
    height: '35%',
  },
  modalDark: {
    backgroundColor: colors.BLACK_10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  headerButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerButtonTextLight: {
    color: colors.GRAY,
  },
  headerButtonTextDark: {
    color: colors.WHITE_80,
  },
  headerButtonPrimary: {
    color: colors.ROYAL_BLUE,
  },
  headerButtonPrimaryDark: {
    color: '#0A84FF',
  },
  optionsWrapper: {
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  optionRow: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  optionRowSpacing: {
    marginBottom: 12,
  },
  optionRowSelectedLight: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  optionRowSelectedDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  optionText: {
    fontSize: 20,
    fontWeight: '500',
  },
  optionTextLight: {
    color: colors.GRAY,
  },
  optionTextDark: {
    color: colors.WHITE_50,
  },
  optionTextSelectedLight: {
    color: colors.BLACK,
  },
  optionTextSelectedDark: {
    color: colors.WHITE,
  },
  timePickerBody: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  timePickerColumn: {
    flex: 1,
  },
  timePicker: {
    width: '100%',
    height: 216,
  },
  timePickerItem: {
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'center',
  },
  timePickerItemLight: {
    color: colors.GRAY,
  },
  timePickerItemDark: {
    color: colors.WHITE,
  },
});
