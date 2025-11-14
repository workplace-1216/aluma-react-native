import {StyleSheet} from 'react-native';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';

export const styles = StyleSheet.create({
  // container interno do conteúdo (já dentro do BottomSheet com gradiente)
  sheetInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 10,
  },

  // Abas (tutores)
  tabRow: {
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 16,
  },
  tabChip: {
    width: 127,
    height: 31,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    
  },
  tabChipSelected: {
    backgroundColor: '#d9d9d9bf',
  },
  tabChipText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
    fontFamily: 'Figtree',
  },
  tabChipTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },

  // Lista de exercícios
  exerciseList: {
    maxHeight: heightToDP('30%'),
    width: 294.78,
  },
  exerciseContent: {
    paddingVertical: 3,
    gap: 10,
  },
  exercisePill: {
    borderRadius: 33,
    borderWidth: 3,
    borderColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  exercisePillSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.76)',
    borderColor: '#FFFFFF',
  },
  exerciseText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'Figtree',
    fontSize: 16,
  },
  exerciseTextSelected: {
    color: '#0E2F3F',
    fontWeight: '700',
  },

  // Botão Start
  startButton: {
    marginTop: '15%',
    alignSelf: 'center',
    width: 296,
    borderRadius: 33,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
  },
  startText: {
    color: '#123c54',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 16,
  },
});
