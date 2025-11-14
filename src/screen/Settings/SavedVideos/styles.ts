// src/screens/SavedVideos/styles.ts
import {StyleSheet} from 'react-native';
import {heightToDP} from 'react-native-responsive-screens';
import colors from '../../../assets/colors';
import Fonts from '../../../assets/fonts';

export const styles = StyleSheet.create({
  container: { flex: 1 },

  listContent: {
    flexGrow: 1,
    paddingVertical: heightToDP('2.5%'),
    gap: 12,
  },

  /* ====== Cards iguais ao BottomHome ====== */
  videoCard: { width: '85%', alignSelf: 'center' },
  videoFrame: {
    height: 100,
    borderRadius: 37,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000', // barras pretas quando necessário
  },
  video: { ...StyleSheet.absoluteFillObject }, // imagem absoluta preenchendo
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 18,
    zIndex: 2,
  },

  /* exatamente como no BottomHome */
  videoSubtitle: {
    position: 'absolute',
    top: 16,
    left: 22,
    right: 22,
    color: '#FFFFFF',
    fontFamily: Fonts.FigtreeSemi,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  videoTitle: {
    position: 'absolute',
    left: 22,
    right: 22,
    top: '50%',
    transform: [{ translateY: -12 }],
    color: '#FFFFFF',
    fontFamily: Fonts.FigtreeBold,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },

  /* ====== Empty state ====== */
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '12%',
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
    paddingHorizontal: '10%',
  },

  /* Fallback simples quando não há background */
  fallbackThumbnail: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'flex-end',
  },
});
