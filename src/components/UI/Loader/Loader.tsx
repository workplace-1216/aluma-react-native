import React from 'react';
import { View, Modal, ActivityIndicator } from 'react-native';
import styles from './styles';
import colors from '../../../assets/colors';

const Loader = (props: any) => {
  const { loading } = props;

  return (
    <Modal
      transparent={true}
      animationType={'fade'}
      visible={loading}
      onRequestClose={() => { }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            animating={loading}
            color={colors.WHITE}
            size="large"
          />
        </View>
      </View>
    </Modal>
  );
};


export default Loader;
