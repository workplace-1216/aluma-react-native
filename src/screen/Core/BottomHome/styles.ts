// styles.ts
import {StyleSheet} from 'react-native';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';
import colors from '../../../assets/colors';
import responsiveUtils from '../../../utils/responsiveUtils';

const CHEVRON_SIZE = 7.3;
const CHEVRON_RATIO = 2.369;

// === Ajustes para posicionar a imagem do card sem cortar o que você quer mostrar ===
const CARD_H = 100;      // mesma altura do frame do card
const THUMB_SHIFT = 24;  // ajuste de deslocamento vertical do recorte (px). Aumente/diminua conforme necessário.

export const styles = StyleSheet.create({
  container: { flex: 1, height: '100%' },
  safeView: { flex: 1 },

  headerView: {
    width: widthToDP('85%'),
    alignSelf: 'center',
    marginBottom: heightToDP('8%'),
  },
  menuButton: {
    alignSelf: 'flex-start',
    paddingVertical: widthToDP('4%'),
    paddingRight: widthToDP('7.5%'),
  },
  volume:{
    marginBottom: heightToDP('2%'),
  },

  buttonView: {
    width: widthToDP('85%'),
    alignSelf: 'center',
    marginBottom: heightToDP('3%'),
  },
  timerButton: {
    marginTop: -5,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE_50,
    borderRadius: 100,
    alignSelf: 'flex-end',
  },
  bottomButtonView: {
    marginTop: heightToDP('2%'),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  playButtonView: {
    width: widthToDP('85%'),
    marginTop: heightToDP('3%'),
    marginBottom: heightToDP('3%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
  },
  Button: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE_50,
    borderRadius: 100,
  },
  ButtonPlay: {
    height: 101,
    width: 101,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE_50,
    borderRadius: 100,
  },
  sliderStyle: {
    width: widthToDP('85%'),
    height: 40,
    alignSelf: 'center',
  },
  spacerView: { width: 69 },

  safeChevronView: { justifyContent: 'center', alignItems: 'center' },
  chevButtonStyle: { padding: widthToDP(2) },
  chevronStyle: {
    height: responsiveUtils.relativeWidth(CHEVRON_SIZE),
    width: responsiveUtils.relativeWidth(CHEVRON_SIZE * CHEVRON_RATIO),
    transform: [{ rotate: '180deg' }],
  },

  // Modal
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContentFullScreen: {
    flex: 1,
    marginTop: 0,
    position: 'relative',
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },

  // Conteúdo principal
  tipsView: { alignSelf: 'center', flex: 1, width: '100%', alignItems: 'center' },

  // ---------- Cards de vídeo (preview) ----------
  videoList: {
    width: '100%',
    alignItems: 'center',
    marginTop: 0,
  },
  videoCard: { width: 340, marginBottom: 12 },
  videoCardLast: { marginBottom: 0 },
  videoSkeletonCard: { width: 340, marginBottom: 12 },
  videoSkeletonFrame: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoFrame: {
    height: CARD_H,      // era 118, agora usa a constante
    borderRadius: 37,
    overflow: 'hidden',
    position: 'relative',
  },
  // Ajuste para permitir reposicionar o conteúdo verticalmente sem cortar o que você quer:
  // - Aumentamos a altura da imagem (CARD_H + THUMB_SHIFT*2) para ter "sobra".
  // - Usamos top: -THUMB_SHIFT para mostrar um pouco mais a parte de baixo da imagem.
  //   Se quiser mostrar mais a parte de cima, troque para top: +THUMB_SHIFT.
  video: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    height: CARD_H + THUMB_SHIFT * 4,
    top: -THUMB_SHIFT,
  },
  videoOverlay: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 18,
    zIndex: 2,
  },
  // Subtítulo em cima (16)
  videoSubtitle: {
    position: 'absolute',
    top: 16,
    left: 22,
    right: 22,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  // Título central (21)
  videoTitle: {
    position: 'absolute',
    left: 22,
    right: 22,
    top: '50%',
    transform: [{ translateY: -12 }],
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // ---------- Fallback texto ----------
  tipScroll: { maxHeight: 190, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  tipScrollContent: { padding: 12 },
  tipText: { color: '#FFF', fontSize: 14, lineHeight: 20, opacity: 0.9 },
  skeletonBar: {
    position: 'absolute',
    height: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  skeletonLineShort: {
    top: 36,
    left: 32,
    right: 180,
  },
  skeletonLineLong: {
    top: 60,
    left: 32,
    right: 32,
  },
  stateContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  stateTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  stateSubtitle: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    opacity: 0.8,
  },
  stateButton: {
    paddingVertical: 8,
    paddingHorizontal: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.WHITE_50,
  },
  stateButtonText: {
    color: colors.WHITE,
    fontWeight: '600',
  },
  // ---------- Player expandido (mantidos p/ compat, não usados com overlay) ----------
  videoExpandedContainer: { width: '100%', alignItems: 'center' },
  videoExpandedFrame: {
    width: '90%',
    alignSelf: 'center',
    height: 360,
    borderRadius: 18,
    overflow: 'hidden',
  },
  videoToolbar: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 80,
    alignItems: 'center',
    flexDirection: 'row',
  },
  returnButton: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 24,
  },
  expandedTitles: { flex: 1 },
  expandedSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    opacity: 0.95,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  expandedTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
    marginTop: 2,
  },

  // Mantidos para compatibilidade (não utilizados no novo layout)
  videoCardExpanded: { width: '100%', alignSelf: 'stretch' },
});
