import React from 'react';
import {View} from 'react-native';
import {goBack} from '../../../navigation/AppNavigator';
import Container from '../../../components/layout/Container';
import {styles} from './styles';
import WebView from 'react-native-webview';
import {webURL} from '../../../constants/constants';
import {HeaderWithBack} from '../../../components/UI/HeaderWithBack';

const Terms: React.FC = () => {
  const url = `${webURL}terms`;
  const handleBack = () => {
    goBack();
  };

  return (
    <Container>
      <View style={styles.container}>
        <HeaderWithBack title={'Terms & Conditions'} onBack={handleBack} />
        <WebView source={{uri: url}} style={styles.webViewStyle} />
      </View>
    </Container>
  );
};

export default Terms;
