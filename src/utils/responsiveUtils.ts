import { Dimensions, PixelRatio } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const dpi = PixelRatio.getFontScale();

const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

/**
 * Returns true of the screen is in landscape mode
 */
const isLandscape = () => {
  const dim = Dimensions.get('window');
  return dim.width >= dim.height;
};

const isLandScapeFlag = isLandscape();

const myWidth = Dimensions.get('window').width;
const myHeight = Dimensions.get('window').height;

const relativeWidth = (ratio: any) => (isLandScapeFlag ? hp(ratio) : wp(ratio));

const relativeHeight = (ratio: any) =>
  isLandScapeFlag ? wp(ratio) : hp(ratio);

// const relativeFontSize = (fontSize: any) => {
//   const fontSizeDpi = fontSize / dpi;
//   console.log('okokko', dpi);
//   return fontSizeDpi;
// };
const BASE_WIDTH = 465;
export function relativeFontSize(size: number): number {
  const scale = myWidth / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export default {
  relativeWidth,
  relativeHeight,
  relativeFontSize,
  myWidth,
  myHeight,
  isLandscape,
  isPortrait,
  isLandScapeFlag,
};
