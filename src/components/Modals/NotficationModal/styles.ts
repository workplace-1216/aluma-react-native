import {StyleSheet} from 'react-native';
import colors from '../../../assets/colors';

const ITEM_HEIGHT = 50;

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent for both themes
    justifyContent: 'flex-end',
  },
  safeView: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },

  // Light theme (default)
  modal: {
    backgroundColor: colors.WHITE,
    borderRadius: 20,
    paddingTop: 10,
    width: '95%',
    alignSelf: 'center',
  },

  // Dark theme modal
  modalDark: {
    backgroundColor: colors.BLACK, // iOS dark background
  },

  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: ITEM_HEIGHT * 3,
    borderBottomWidth: 1,
    borderColor: colors.BORDER_GRAY,
  },
  picker: {
    height: 170,
    width: '100%',
  },
  wheel: {
    alignItems: 'center',
    width: 80,
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Light theme text
  wheelText: {
    fontSize: 20,
    color: colors.BLACK,
  },

  // Dark theme text
  wheelTextDark: {
    color: '#FFFFFF',
  },

  selectedText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#000',
  },

  // Light theme confirm button
  confirmButtonStyle: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  // Dark theme confirm button
  confirmButtonDark: {
    backgroundColor: colors.BLACK, // Keep same as modal background
  },

  // Light theme cancel button
  buttonStyle: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: colors.WHITE,
    paddingVertical: 20,
    marginVertical: 7,
    borderRadius: 15,
    alignItems: 'center',
  },

  // Dark theme cancel button
  buttonStyleDark: {
    backgroundColor: colors.BLACK, // iOS dark background
  },

  // Light theme text
  confirmText: {
    fontSize: 18,
    color: '#007AFF',
  },

  // Dark theme confirm text (same blue works well in both themes)
  confirmTextDark: {
    color: '#0A84FF', // iOS dark mode blue
  },

  cancelText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },

  // Dark theme cancel text
  cancelTextDark: {
    color: '#0A84FF', // iOS dark mode blue
  },
});
