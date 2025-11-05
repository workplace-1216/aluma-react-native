// styles.ts (arquivo completo)
import {StyleSheet} from 'react-native';
import {heightToDP, widthToDP} from 'react-native-responsive-screens';
import colors from '../../../assets/colors';
import responsiveUtils from '../../../utils/responsiveUtils';

const CHEVRON_SIZE = 7.3;
const CHEVRON_RATIO = 2.369;

export const styles = StyleSheet.create({
  container: { flex: 1, height: '100%' },
  safeView: { flex: 1 },

  headerView: {
    width: widthToDP('85%'),
    alignSelf: 'center',
    marginBottom: heightToDP('1%'),
  },
  menuButton: {
    alignSelf: 'flex-start',
    paddingVertical: widthToDP('4%'),
    paddingRight: widthToDP('7.5%'),
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
    gap: 15,
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
  modalContainer: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  modalContentFullScreen: { flex: 1, marginTop: 0, backgroundColor: 'blue' },

  // Conteúdo principal
  tipsView: { alignSelf: 'center', flex: 1, width: '100%', alignItems: 'center' },

  // ---------- Cards de vídeo (preview) ----------
  videoList: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
    marginTop: 0,
  },
  videoCard: { width: '90%' },
  videoFrame: {
    height: 180,
    borderRadius: 37,
    overflow: 'hidden',
    position: 'relative',
  },
  video: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  videoOverlay: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  // Subtítulo em cima (16)
  videoSubtitle: {
    position: 'absolute',
    top: 16,
    left: 22,
    right: 22,
    color: '#FFFFFF',
    fontSize: 16,
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

  // ---------- Player expandido ----------
  videoExpandedContainer: { width: '100%', alignItems: 'center' },
  videoExpandedFrame: {
    width: '90%',
    alignSelf: 'center',
    height: 360,
    borderRadius: 18,
    overflow: 'hidden',
  },
  videoExpanded: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  videoToolbar: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 80,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
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
