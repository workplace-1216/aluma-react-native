import React, {useState} from 'react';
import {View} from 'react-native';
import {goBack, navigate} from '../../../navigation/AppNavigator';
import routes from '../../../constants/routes';
import Container from '../../../components/layout/Container';
import {styles} from './styles';
import {useAppSelector} from '../../../redux/store';
import {updateUser} from '../../../service/auth/updateUser';
import {useDispatch} from 'react-redux';
import {setUser} from '../../../redux/slice/userSlice';
import showToast from '../../../components/UI/CustomToast/CustomToast';
import {SettingsOptionDivider} from '../../../components/UI/SettingsOptionDivider';
import {HeaderWithBack} from '../../../components/UI/HeaderWithBack';
import {SettingsOptionItem} from '../../../components/UI/SettingsOptionItem';
import {widthToDP} from 'react-native-responsive-screens';
import {getFcmToken} from '../../../utils/getFcmToken';
import {attachFcmToken} from '../../../service/auth/guestLogin';

type LoadingToggle = 'allowNotifications' | 'dailyQouteNotification' | null;

const Notifications: React.FC = () => {
  const dispatch = useDispatch();
  const user = useAppSelector(state => state.user);
  const [allowNotifications, setAllowNotifications] = useState(
    user.allowNotifications || false,
  );
  const [dailyQuote, setDailyQuote] = useState(
    user.dailyQouteNotification || false,
  );
  const [loadingToggle, setLoadingToggle] = useState<LoadingToggle>(null);

  const handleBack = () => {
    goBack();
  };

  const handleMindfulReminder = () => {
    navigate(routes.MINDFUL_REMINDER);
  };

  const handleBedtimeReminder = () => {
    navigate(routes.BEDTIME_REMINDER);
  };

  const handleToggleChange = async (
    key: 'allowNotifications' | 'dailyQouteNotification',
    value: boolean,
  ) => {
    setLoadingToggle(key);

    try {
      const updatedUser = await updateUser(user._id, {[key]: value});
      dispatch(
        setUser({
          ...user,
          [key]: updatedUser[key],
        }),
      );

      if (key === 'allowNotifications') {
        setAllowNotifications(updatedUser.allowNotifications);
        if (value) {
          try {
            const token = await getFcmToken();
            if (token && token !== 'dummyToken') {
              await attachFcmToken(token);
            }
          } catch (attachError) {
            console.warn('Failed to attach FCM token', attachError);
          }
        }
      } else {
        setDailyQuote(updatedUser.dailyQouteNotification);
      }
    } catch (error: any) {
      if (key === 'allowNotifications') {
        setAllowNotifications(!value);
      } else {
        setDailyQuote(!value);
      }

      showToast(
        error?.data?.message || 'Failed to update, please try again',
        'error',
      );
    } finally {
      // Clear the loading state
      setLoadingToggle(null);
    }
  };

  return (
    <Container>
      <View style={styles.container}>
        <HeaderWithBack title={'Notifications'} onBack={handleBack} />

        <View style={{gap: widthToDP(4), marginTop: widthToDP(4)}}>
          <SettingsOptionItem
            title={'Allow notification'}
            hasToggle
            toggleValue={allowNotifications}
            onToggleChange={val =>
              handleToggleChange('allowNotifications', val)
            }
            isToggleLoading={loadingToggle === 'allowNotifications'}
          />
          <SettingsOptionItem
            title={'Daily quote'}
            hasToggle
            toggleValue={dailyQuote}
            onToggleChange={val =>
              handleToggleChange('dailyQouteNotification', val)
            }
            isToggleLoading={loadingToggle === 'dailyQouteNotification'}
          />
          <SettingsOptionDivider />
          <SettingsOptionItem
            title={'Mindful Reminder'}
            onPress={handleMindfulReminder}
            hasRightArrow
          />
          <SettingsOptionItem
            title={'Bedtime Reminder'}
            onPress={handleBedtimeReminder}
            hasRightArrow
          />
        </View>
      </View>
    </Container>
  );
};

export default Notifications;
