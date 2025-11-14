// styles.ts
import { StyleSheet } from 'react-native';
import colors from '../../../assets/colors';

const ITEM_HEIGHT = 50;

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  safeArea: {
    width: '100%',
  },
  safeAreaDark: {
    backgroundColor: 'transparent',
  },

  /* Bottom sheet */
  sheet: {
    width: '100%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: 'hidden',
  },
  sheetLight: {
    backgroundColor: colors.WHITE,
  },
  sheetDark: {
    backgroundColor: '#000', // iOS dark
  },

  /* Header (Cancel / Play) */
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLight: {
    borderBottomColor: '#E5E5EA',
    backgroundColor: colors.WHITE,
  },
  headerDark: {
    borderBottomColor: '#1C1C1E',
    backgroundColor: '#000',
  },
  headerAction: {
    fontSize: 18,
    fontWeight: '600',
  },
  actionLight: {
    color: '#007AFF',
  },
  actionDark: {
    color: '#FFFFFF',
  },
  headerActionPrimary: {},
  actionPrimaryLight: {
    color: '#007AFF',
  },
  actionPrimaryDark: {
    color: '#FFFFFF',
  },

  /* Picker wheel */
  pickerContainer: {
    height: ITEM_HEIGHT * 5, // 5 linhas visíveis, como no iOS
    justifyContent: 'center',
  },
  picker: {
    height: ITEM_HEIGHT * 5,
    width: '100%',
  },
  pickerItemText: {
    fontSize: 20,
  },
  pickerItemTextLight: {
    color: colors.BLACK,
  },
  pickerItemTextDark: {
    color: '#FFFFFF',
  },
});