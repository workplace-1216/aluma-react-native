import React, {useState} from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import {SvgMail} from '../../../assets/svg';
import KeyboardContainer from '../../../components/layout/KeyboardContainer';
import CustomTextInput from '../../../components/UI/CustomTextInput';
import {forgotPassword} from '../../../service/auth/forgetPassword';
import BackHeader from '../../../components/Features/Authentication/BackHeader';
import AuthContainer from '../../../components/Features/Authentication/AuthContainer';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>('');
  const [success, setSuccess] = useState<string | null>('');

  const handleSendEmail = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await forgotPassword({email});
      setSuccess('A reset link has been sent to your email!');
    } catch (err: any) {
      setError(err?.data || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardContainer>
      <View style={styles.container}>
        <BackHeader />
        <AuthContainer
          error={`${error}`}
          success={`${success}`}
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
      </View>
    </KeyboardContainer>
  );
};

export default ForgotPassword;
