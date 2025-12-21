import React from 'react';
import {Dimensions, View} from 'react-native';
import Svg, {Text, TextPath, Defs, Path, G} from 'react-native-svg';
import Fonts from '../../../assets/fonts';
import {FREQUENCY} from '../../../redux/slice/moodSlice';

const {width} = Dimensions.get('window');
const circleSize = width * 0.9;

interface CurvedTextProps {
  texts?: string[];
  onTextPress?: (id: number) => void;
  frequency: FREQUENCY | undefined;
}

const CurvedText: React.FC<CurvedTextProps> = ({
  texts = ['Ocean Waves', 'Rain Forest', 'Ocean', 'Rain'],
  frequency,
}) => {
  const quadrants = frequency?.moodWheelItems?.[0]?.quadrants || [];

  // Calculate quadrant center positions
  const calculateQuadrantCenters = (
    textArray: string[],
    numQuadrants: number,
  ): string[] => {
    const centers: string[] = [];

    // Special case: single text at 50% with rotated SVG
    if (numQuadrants === 1) {
      centers.push('50%'); // 50% = top position with rotated SVG
      return centers;
    }

    // Special positioning for 3 texts
    if (numQuadrants === 3) {
      // Position 1: Top left (315° from top = 87.5% around circle)
      centers.push('37.5%');
      // Position 2: Right Mid (90° from top = 25% around circle)
      centers.push('75%');
      // Position 3: Bottom left (225° from top = 62.5% around circle)
      centers.push('12.5%');
      return centers;
    }

    // Special positioning for 4 texts
    if (numQuadrants === 4) {
      // Position 1: Top left (315° from top = 87.5% around circle)
      centers.push('37.5%');
      // Position 2: Top Right (45° from top = 12.5% around circle)
      centers.push('62.5%');
      // Position 3: Bottom left (225° from top = 62.5% around circle)
      centers.push('12.5%');
      // Position 4: Bottom Right (135° from top = 37.5% around circle)
      centers.push('87.5%');
      return centers;
    }

    // For other numbers, use the original even distribution logic
    for (let i = 0; i < numQuadrants; i++) {
      // Each quadrant spans 360° / numQuadrants
      const quadrantAngle = 360 / numQuadrants;

      // Center of each quadrant (in degrees from top)
      const centerAngle = i * quadrantAngle + quadrantAngle / 2;

      // Convert to percentage along the circle path
      const percentage = (centerAngle / 360) * 100;

      centers.push(`${percentage.toFixed(1)}%`);
    }

    return centers;
  };

  const centerOffsets = calculateQuadrantCenters(
    texts,
    quadrants.length || texts.length,
  );

  return (
    <View>
      <Svg
        tabIndex={0}
        height={circleSize}
        width={circleSize}
        transform="rotate(-180 100 100)"
        viewBox="0 0 200 200">
        <Defs>
          {/* Original path without rotation */}
          <Path id="curvePath" d="M 100,10 A 90,90 0 1,1 99.99,10" />
        </Defs>
        {quadrants?.map((item, index) => (
          <G key={index}>
            <Text
              fill="white"
              fontSize="11"
              fontWeight="500"
              fontFamily={Fonts.FigtreeMedium}
              textAnchor="middle">
              {' '}
              {/* This centers the text at the startOffset position */}
              <TextPath
                href="#curvePath"
                startOffset={centerOffsets[index] || '50%'}>
                {item?.title}
              </TextPath>
            </Text>
          </G>
        ))}
      </Svg>
    </View>
  );
};

export default CurvedText;
