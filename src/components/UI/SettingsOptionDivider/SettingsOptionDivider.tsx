import React from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import {widthToDP} from 'react-native-responsive-screens';

type Props = {
  space?: Number;
  style?: Object;
};

const SettingsOptionDivider = ({space = 2.2, style}: Props) => (
  <>
    <View
      style={[styles.divider, {marginVertical: widthToDP(space), ...style}]}
    />
  </>
);

export default SettingsOptionDivider;
