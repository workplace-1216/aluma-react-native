import {StyleSheet} from 'react-native';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';
import colors from '../../../assets/colors';

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
    width: widthToDP('30%'),
    minWidth: 110,
    maxWidth: 150,
    minHeight: 31,
    paddingHorizontal: 10,
    paddingVertical: 6,
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
    maxHeight: heightToDP('40%'),
    width: '90%',
    minWidth: 260,
    maxWidth: 320,
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
    marginTop: heightToDP('4%'),
    alignSelf: 'center',
    width: '90%',
    minWidth: 220,
    maxWidth: 320,
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
  tabChipSkeleton: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  skeletonList: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: heightToDP('3%'),
    gap: 12,
  },
  exercisePillSkeleton: {
    width: '90%',
    height: 48,
    borderRadius: 33,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  skeletonState: {
    width: '100%',
  },
  stateContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: widthToDP('10%'),
    paddingVertical: heightToDP('3%'),
  },
  stateTitle: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  stateSubtitle: {
    color: colors.WHITE,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    opacity: 0.8,
  },
  retryButton: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.WHITE,
    paddingHorizontal: 28,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: colors.WHITE,
    fontWeight: '600',
    fontSize: 14,
  },
});
