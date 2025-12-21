import React, {useEffect} from 'react';
import {View, Text, FlatList} from 'react-native';
import routes from '../../../constants/routes';
import {goBack, navigate} from '../../../navigation/AppNavigator';
import Container from '../../../components/layout/Container';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {updatePlayingTime} from '../../../redux/slice/userSlice';
import {logout} from '../../../service/auth/logout';
import {styles} from './styles';
import {googleKey} from '../../../constants/constants';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {googleSignOut} from '../../../service/auth/googleSignUp';
import showToast from '../../../components/UI/CustomToast/CustomToast';
import {SettingsOptionItem} from '../../../components/UI/SettingsOptionItem';
import {heightToDP} from 'react-native-responsive-screens';
import {HeaderWithBack} from '../../../components/UI/HeaderWithBack';
import {setUserPlayingTime} from '../../../service/users/setUserPlayingTime';
import {audioController} from '../../../services/audio/AudioController';
import {performLogout} from '../../../utils/session/logout';

const settingsOptions = [
  {
    title: 'Account Information',
    onPress: () => navigate(routes.ACCOUNT_INFO),
  },
  {
    title: 'Notifications',
    onPress: () => navigate(routes.NOTIFICATIONS),
    sectionFinish: true,
  },
  {
    title: 'Voice Guides',
    onPress: () => navigate(routes.VOICE_GUIDES),
  },
  {
    title: 'Saved Frequencies',
    onPress: () => navigate(routes.FREQUENCIES),
  },{
    title: 'Saved Videos',
    onPress: () => navigate(routes.SAVED_VIDEOS),
    sectionFinish: true,
  },
  {
    title: 'Invite Friends',
    onPress: () => navigate(routes.INVITE_FRIENDS),
    
  },

  {
    title: 'Terms & Conditions',
    onPress: () => navigate(routes.TERMS_CONDITION),
  },
  {
    title: 'Privacy & Security',
    onPress: () => navigate(routes.PRIVACY_SECURITY),
  },
  {
    title: 'About',
    onPress: () => navigate(routes.ABOUT),
  },
  {
    title: 'Logout',
    onPress: () => {
      // To be assigned inside component
    },
  },
];

const ListFooter = () => (
  <View style={styles.versionContainer}>
    <Text style={styles.versionText}>Version 2.0 (202204)</Text>
  </View>
);

const Settings: React.FC = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.token?.token);
  const user = useAppSelector(state => state.user);
  const playTime = useAppSelector(state => state.user.playingTime);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: googleKey,
    });
  }, []);

  const handleBack = () => goBack();

  const handleSetUserPlayingTime = async () => {
    if (!playTime) {return;}
    const today = new Date().toDateString();
    const payload = {
      count: playTime.lastPlayingTimeDate === today ? playTime.count : 0,
      lastPlayingTimeDate: today,
    };

    try {
      await setUserPlayingTime(payload);
      dispatch(updatePlayingTime(payload));
    } catch (error) {
      console.error('Failed to set user playing time in splash:', error);
    }
  };

  const handleLogout = async () => {
    // stop any active playback before clearing session state
    audioController.pauseAll();
    try {
      await handleSetUserPlayingTime();

      if (token) {await logout(token);}
      if (user.googleAccount) {
        await googleSignOut();
      }
      showToast('Logging out...');
      performLogout({
        reason: 'manual',
        message: 'Logged out.',
        targetRoute: routes.CONNECT,
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      performLogout({
        reason: 'manual',
        message:
          error?.data?.message ||
          'An error occurred during logout. Please try again.',
        targetRoute: routes.CONNECT,
      });
    }
  };

  // Assign handleLogout to Logout option
  const optionsWithLogout = settingsOptions.map(option =>
    option.title === 'Logout' ? {...option, onPress: handleLogout} : option,
  );

  return (
    <Container>
      <HeaderWithBack title={'Settings'} onBack={handleBack} />
      <FlatList
        data={optionsWithLogout}
        scrollEnabled={true}
        contentContainerStyle={{paddingTop: heightToDP(1.25)}}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => (
          <SettingsOptionItem
            title={item.title}
            onPress={item.onPress}
            key={`${item.title}`}
            showDivider={item.sectionFinish}
          />
        )}
        ListFooterComponent={ListFooter}
      />
    </Container>
  );
};

export default Settings;
