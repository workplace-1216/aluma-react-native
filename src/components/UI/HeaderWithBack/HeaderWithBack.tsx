import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import {SvgBack} from '../../../assets/svg';
import {widthToDP} from 'react-native-responsive-screens';

type Props = {
  onBack: (() => {}) | (() => void) | (() => null);
  title: String;
};

const HeaderWithBack = ({onBack, title}: Props) => (
  <>
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        style={[styles.navSideSpace, styles.backButton]}>
        <SvgBack width={widthToDP(6)} height={widthToDP(6)} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.navSideSpace} />
    </View>
  </>
);

export default HeaderWithBack;
