import {Dimensions, Platform, StyleSheet} from 'react-native';
import colors from '../../../assets/colors';
import Fonts from '../../../assets/fonts';
import responsiveUtils from '../../../utils/responsiveUtils';

const IMAGE_WIDTH = Dimensions.get('window').width / 1.5;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  safeArea: {
    flex: 1,
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? '2%' : 0,
    marginBottom: 30,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingLeft: '6%',
    zIndex: 2,
  },
  header: {
    fontFamily: Fonts.FigtreeSemi,
    fontSize: responsiveUtils.relativeFontSize(23),
    color: colors.WHITE,
    textAlign: 'center',
    position: 'absolute',
    alignSelf: 'center',
    width: '100%',
  },
  borderBottomLine: {
    width: '100%',
    borderBottomColor: colors.WHITE,
    opacity: 0.35,
    borderBottomWidth: 1,
  },
  moodImage: {
    height: IMAGE_WIDTH,
    width: IMAGE_WIDTH,
    borderRadius: IMAGE_WIDTH / 2,
    alignSelf: 'center',
    marginVertical: 20,
  },
  listContent: {
    paddingBottom: 30,
  },
  itemContainer: {
    // Mantém o layout e o separador
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height:108,
    paddingHorizontal: '10%',
    borderTopWidth: 1,
    gap: 10,
    borderTopColor: colors.WHITE_35,
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontFamily: Fonts.FigtreeSemi,
    color: colors.WHITE,
    fontSize: responsiveUtils.relativeFontSize(19),
    marginBottom: 4,
  },
  description: {
    fontFamily: Fonts.FigtreeMedium,
    color: colors.WHITE,
    fontSize: responsiveUtils.relativeFontSize(12),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    fontFamily: Fonts.FigtreeSemi,
    color: colors.WHITE,
    fontSize: responsiveUtils.relativeFontSize(23),
  },

  /* === ADIÇÕES PARA BACKGROUND DA CÉLULA === */
 itemOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0,0,0,0.28)', // escurece levemente a imagem
},
itemBgFull: {
  ...StyleSheet.absoluteFillObject, // cobre todo o retângulo do item
  // se quiser cantos arredondados, adicione borderRadius aqui
  // borderRadius: 12,
},
itemRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
});
