import {SafeAreaView} from 'react-native-safe-area-context';
import React from 'react';
import {styles} from './styles';
import CustomButton from '../../../components/UI/CustomButton/CustomButton';
import {navigate} from '../../../navigation/AppNavigator';
import routes from '../../../constants/routes';
import Container from '../../../components/layout/Container';
import BackHeader from '../../../components/Features/Authentication/BackHeader';
import AuthContainer from '../../../components/Features/Authentication/AuthContainer';

const Connect = () => {
  const navigateLogin = () => {
    navigate(routes.SIGN_IN);
  };

  const navigateSignUp = () => {
    navigate(routes.SIGN_UP);
  };

  return (
    <Container>
      <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
        <BackHeader />
        <AuthContainer description="A mindfulness space for your sleep, meditation and relaxation">
          <CustomButton
            title={'Sign Up'}
            variant={'filled'}
            onPress={navigateSignUp}
          />
          <CustomButton
            title={'Log In'}
            variant={'outline'}
            onPress={navigateLogin}
          />
        </AuthContainer>
      </SafeAreaView>
    </Container>
  );
};

export default Connect;
