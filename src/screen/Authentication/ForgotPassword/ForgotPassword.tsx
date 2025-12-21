import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import {SvgMail} from '../../../assets/svg';
import KeyboardContainer from '../../../components/layout/KeyboardContainer';
import CustomTextInput from '../../../components/UI/CustomTextInput';
import {forgotPassword} from '../../../service/auth/forgetPassword';
import BackHeader from '../../../components/Features/Authentication/BackHeader';
import AuthContainer from '../../../components/Features/Authentication/AuthContainer';
import {navigate} from '../../../navigation/AppNavigator';
import routes from '../../../constants/routes';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleSendEmail = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await forgotPassword({email});
      setSuccess('A reset link has been sent to your email!');
    } catch (err: any) {
      setError(err?.data || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => navigate(routes.CONNECT);

  return (
    <KeyboardContainer>
      <View style={styles.container}>
        <View style={styles.backButton}>
          <BackHeader showBackBtn />
        </View>
        <AuthContainer
          error={error || ''}
          success={success || ''}
          loading={loading}
          handlePress={handleSendEmail}
          showFooterBtn
          buttonText={loading ? 'Sending...' : 'Send email'}
          email={email}>
          <CustomTextInput
            Icon={SvgMail}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
           
        </AuthContainer>
        <TouchableOpacity
          onPress={handleBackToLogin}
          style={styles.backButton1}
          activeOpacity={0.8}>
          <Text style={styles.backToLoginText}>Back to login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardContainer>
  );
};

export default ForgotPassword;
