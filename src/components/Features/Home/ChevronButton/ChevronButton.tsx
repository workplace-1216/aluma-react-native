import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import LottieView from 'lottie-react-native';
import images from '../../../../assets/images';
import {styles} from './styles';

type Props = {
  onPress: () => void;
};

const ChevronButton: React.FC<Props> = ({onPress}) => (
  <View style={styles.safeView}>
    <TouchableOpacity onPress={onPress} style={styles.chevButtonStyle}>
      <LottieView
        source={images.lottieDownChevronAnimation}
        autoPlay
        loop
        style={styles.chevronStyle}
      />
    </TouchableOpacity>
  </View>
);

export default ChevronButton;
