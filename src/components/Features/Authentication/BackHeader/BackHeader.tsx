import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import {styles} from './styles';
import {SvgBack} from '../../../../assets/svg';
import {goBack} from '../../../../navigation/AppNavigator';
import {widthToDP} from 'react-native-responsive-screens';

interface BackHeaderProps {
  handleNavigation?: () => void;
  showBackBtn?: boolean;
}

const BackHeader = ({
  handleNavigation,
  showBackBtn = false,
}: BackHeaderProps) => {
  const handleBack = () => {
    if (handleNavigation) {
      handleNavigation;
    } else {
      goBack();
    }
  };

  return (
    <View style={styles.backButtonWrapper}>
      {showBackBtn && (
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <SvgBack width={widthToDP('6.744%')} height={widthToDP('6.481%')} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default BackHeader;
