import {StyleSheet} from 'react-native';
import {widthToDP} from 'react-native-responsive-screens';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 10,
    textAlign: 'center',
  },

  list: {
    width: 294,
    gap: 12,

  },

  pill: {
    width: '100%',
    borderRadius: 33,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillSelected: {
    backgroundColor: 'rgba(255,255,255,0.70)', // preenchido claro (como no mock)
  },

  pillText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
  },
  pillTextSelected: {
    color: '#0F2B3A', // texto escuro quando selecionado
  },

  startButton: {
    width: widthToDP('76%'),
    backgroundColor: '#FFFFFF',
    borderRadius: 33,
    paddingVertical: 14,
    marginTop: '13%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startText: {
    color: '#0F2B3A',
    fontWeight: '500',
    fontSize: 16,
  },
});
