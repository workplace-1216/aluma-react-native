import {StyleSheet} from 'react-native';
import responsiveUtils from '../../../utils/responsiveUtils';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: responsiveUtils.relativeFontSize(18),
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  content: {
    marginTop: 10,
  },
});
