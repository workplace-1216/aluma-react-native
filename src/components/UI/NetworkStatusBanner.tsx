import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useNetworkStatus} from '../../context/NetworkProvider';

const NetworkStatusBanner: React.FC = () => {
  const {isConnected, isInternetReachable} = useNetworkStatus();
  const offline =
    !isConnected || (isInternetReachable === false);

  if (!offline) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>No internet connection</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: '#FF4D4F',
    paddingVertical: 6,
    alignItems: 'center',
    zIndex: 50,
  },
  text: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default NetworkStatusBanner;
