import React, {useCallback, useState} from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import Container from '../../../components/layout/Container';
import {reset} from '../../../navigation/AppNavigator';
import routes from '../../../constants/routes';
import SelectableList from '../../../components/UI/SelectableList/SelectableList';
import {options} from '../../../constants/data';
import BackHeader from '../../../components/Features/Authentication/BackHeader';
import AuthContainer from '../../../components/Features/Authentication/AuthContainer';
import {useAppDispatch} from '../../../redux/store';
import {loginGuestSession} from '../guestAuth';
import {updateUser} from '../../../service/auth/updateUser';
import {setUser} from '../../../redux/slice/userSlice';

const GuestPurpose: React.FC = () => {
  const dispatch = useAppDispatch();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleContinue = useCallback(async () => {
    if (!selectedOption) {
      setErrorMessage('Please select a purpose to continue');
      return;
    }

    setErrorMessage('');

    try {
      setLoading(true);
      const {user} = await loginGuestSession({dispatch});

      if (user?._id) {
        try {
          await updateUser(user._id, {purpose: selectedOption});
        } catch (err) {
          console.warn('Failed to persist guest purpose', err);
        } finally {
          dispatch(setUser({...user, purpose: selectedOption}));
        }
      }

      reset(routes.HOME);
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        'Something went wrong. Please try again.';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }, [dispatch, selectedOption]);

  return (
    <Container>
      <View style={styles.container}>
        <BackHeader showBackBtn />
        <AuthContainer
          error={`${errorMessage}`}
          description="What do you want to focus on during this part of your journey?"
          showFooterBtn
          buttonText="Continue"
          handlePress={handleContinue}
          loading={loading}
          signUpPurpose>
          <SelectableList
            options={options}
            onSelect={option => {
              setSelectedOption(option);
              setErrorMessage('');
            }}
          />
        </AuthContainer>
      </View>
    </Container>
  );
};

export default GuestPurpose;
