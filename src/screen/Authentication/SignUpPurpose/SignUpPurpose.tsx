import React, {useState} from 'react';
import {styles} from './styles';
import Container from '../../../components/layout/Container';
import {navigate, reset} from '../../../navigation/AppNavigator';
import routes from '../../../constants/routes';
import SelectableList from '../../../components/UI/SelectableList/SelectableList';
import {options} from '../../../constants/data';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useAppDispatch} from '../../../redux/store';
import {setToken} from '../../../redux/slice/authSlice';
import {setUser, UserState} from '../../../redux/slice/userSlice';
import {setPurposeAPI} from '../../../service/auth/setPurpose';
import {View} from 'react-native';
import {fetchAllGuidedVoiceSettings} from '../../../service/tutors/fetchAllGuidedVoiceSettings';
import BackHeader from '../../../components/Features/Authentication/BackHeader';
import AuthContainer from '../../../components/Features/Authentication/AuthContainer';

type SignUpPurposeRouteParams = {
  signUpType: 'email' | 'google';
  user?: {
    user: {
      _id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      purpose: string;
      selectedOption: string;
      allowNotifications: boolean;
      dailyQouteNotification: boolean;
      sessions: {
        count: number;
        lastSessionDate?: string;
      };
    };
    tokens: {
      access: string;
    };
  };
};

const SignUpPurpose: React.FC = () => {
  const route =
    useRoute<RouteProp<Record<string, SignUpPurposeRouteParams>, string>>();
  const signUpType = route.params?.signUpType;
  const dispatch = useAppDispatch();
  const user = route.params?.user;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const navigateSignUp = async () => {
    if (!selectedOption) {
      setErrorMessage('Please select a purpose to continue');
      return;
    }

    setErrorMessage('');

    if (signUpType === 'email') {
      navigate(routes.SIGN_UP_EMAIL, {purpose: selectedOption});
    } else if (signUpType === 'google') {
      if (!user) {
        setErrorMessage('User information is missing.');
        return;
      }

      try {
        await setPurposeAPI({email: user.user.email, purpose: selectedOption});

        const userData: UserState = user.user;

        if (user.tokens.access) {
          dispatch(fetchAllGuidedVoiceSettings());
        }
        dispatch(setToken(user.tokens.access));
        dispatch(setUser({...userData, purpose: selectedOption}));

        reset(routes.HOME);
      } catch (error: any) {
        if (error.data && error.data.message) {
          setErrorMessage('Something went wrong. Please try again.');
        }
        console.error('Set purpose error:', error);
      }
    }
  };

  return (
    <Container>
      <View style={styles.container}>
        <BackHeader showBackBtn />
        <AuthContainer
          error={`${errorMessage}`}
          description="What do you want to focus on during this part of your journey?"
          showFooterBtn
          buttonText="Continue"
          handlePress={navigateSignUp}
          signUpPurpose>
          <SelectableList
            options={options}
            onSelect={option => {
              setSelectedOption(option);
              setErrorMessage(''); // clear error on select
            }}
          />
        </AuthContainer>
      </View>
    </Container>
  );
};

export default SignUpPurpose;
