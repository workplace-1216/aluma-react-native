import React from 'react';
import {View} from 'react-native';
import {goBack} from '../../../navigation/AppNavigator';
import Container from '../../../components/layout/Container';
import {styles} from './styles';
import WebView from 'react-native-webview';
import {webURL} from '../../../constants/constants';
import {HeaderWithBack} from '../../../components/UI/HeaderWithBack';

const Privacy: React.FC = () => {
  const url = `${webURL}privacy`;
  const handleBack = () => {
    goBack();
  };

  return (
    <Container>
      <View style={styles.container}>
        <HeaderWithBack onBack={handleBack} title={'Privacy & Security'} />
        <WebView source={{uri: url}} style={styles.webViewStyle} />
      </View>
    </Container>
  );
};

export default Privacy;
