import React, {useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {goBack} from '../../../navigation/AppNavigator';
import Container from '../../../components/layout/Container';
import {SvgChevronDown} from '../../../assets/svg';
import {styles} from './styles';
import {getMindfulReminder} from '../../../service/notifications/mindfulReminder';
import {useAppSelector} from '../../../redux/store';
import {getFcmToken} from '../../../utils/getFcmToken';
import {updateMindfulReminder} from '../../../service/notifications/updateMindfulReminder';
import showToast from '../../../components/UI/CustomToast/CustomToast';
import {deleteMindfulReminder} from '../../../service/notifications/deleteMindfulReminder';
import NotificationModal, {
  TimePickerModal,
} from '../../../components/Modals/NotficationModal';
import {HeaderWithBack} from '../../../components/UI/HeaderWithBack';
import {SettingsOptionItem} from '../../../components/UI/SettingsOptionItem';
import {SettingsOptionDivider} from '../../../components/UI/SettingsOptionDivider';
import {syncFcmTokenWithBackend} from '../../../services/notifications/syncFcmToken';
import {showLocalNotification} from '../../../services/notifications/NotificationService';

const MindfulReminder: React.FC = () => {
  const user = useAppSelector(state => state.user);
  const didMountRef = useRef(false);

  const [enableReminder, setEnableReminder] = useState<boolean | null>(null);
  const [selectedHour, setSelectedHour] = useState(10);
  const [selectedMinute, setSelectedMinute] = useState(50);
  const [frequency, setFrequency] = useState('Every day');
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [isFrequencyModalVisible, setFrequencyModalVisible] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const frequencyOptions = ['Week days', 'Every day', 'Weekends'];
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const handleBack = () => {
    goBack();
  };

  const formatTime = () => {
    const formattedHour =
      selectedHour < 10 ? `0${selectedHour}` : selectedHour;
    const formattedMinute =
      selectedMinute < 10 ? `0${selectedMinute}` : selectedMinute;
    return `${formattedHour}:${formattedMinute}`;
  };

  const showTimePicker = () => {
    setTimePickerVisible(true);
  };
  const closeTimePicker = () => {
    setTimePickerVisible(false);
  };

  const mapFrequencyToDays = (value: string) => {
    switch (value.toLowerCase()) {
      case 'every day':
        return 'everyday';
      case 'week days':
        return 'weekdays';
      case 'weekends':
        return 'weekend';
      default:
        return '';
    }
  };

  const persistReminderTime = async (hour24: number, minute: number) => {
    if (!user?._id) {return;}

    try {
      const fcmToken = await getFcmToken();
      await syncFcmTokenWithBackend(fcmToken);
      const body = {
        userId: user._id,
        time: `${hour24}:${minute}`,
        timezone: timezone,
        days: mapFrequencyToDays(frequency),
        fcmToken: fcmToken,
      };

      await updateMindfulReminder(body);
      await showLocalNotification({
        title: 'Reminder saved',
        body: `We’ll remind you at ${formatTime()} (${frequency})`,
      });
    } catch (error) {
      console.error('Time update failed:', error);
      showToast('Failed to update time.', 'error');
    }
  };

  const handleTimeConfirm = async (hour: number, minute: number) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);

    await persistReminderTime(hour, minute);
    closeTimePicker();
  };

  const showFrequencyModal = () => {
    setFrequencyModalVisible(true);
  };

  const hideFrequencyModal = () => {
    setFrequencyModalVisible(false);
  };

  const handleFrequencySelect = (option: string) => {
    setFrequency(option);
  };

  const handleMindfulReminderUpdate = async () => {
    if (enableReminder === null) {return;}

    await persistReminderTime(selectedHour, selectedMinute);
  };

  useEffect(() => {
    if (didMountRef.current && isDataLoaded && enableReminder !== null) {
      handleMindfulReminderUpdate();
    } else {
      didMountRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableReminder]);

  const fetchMindfulReminderData = async () => {
    if (user._id) {
      try {
        const response = await getMindfulReminder(user._id);

        if (response?.success && response?.reminder) {
          const {time, days} = response.reminder;

          const [hourStr, minuteStr] = time.split(':');
          let hour = parseInt(hourStr, 10);
          const minute = parseInt(minuteStr, 10);
          setEnableReminder(true);
          setSelectedHour(hour);
          setSelectedMinute(minute);

          const frequencyMap: {[key: string]: string} = {
            weekdays: 'Week days',
            everyday: 'Every day',
            weekend: 'Weekends',
          };

          setFrequency(frequencyMap[days] || 'Every day');
        } else {
          setEnableReminder(false);
        }
        setIsDataLoaded(true);
      } catch (error) {
        setEnableReminder(false);
        setIsDataLoaded(true);
      }
    }
  };

  useEffect(() => {
    fetchMindfulReminderData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Container>
      <View style={styles.container}>
        <HeaderWithBack title={'Notifications'} onBack={handleBack} />

        <View style={styles.content}>
          <SettingsOptionItem
            title="Mindful Reminder"
            hasToggle
            toggleValue={!!enableReminder}
            onToggleChange={async value => {
              setEnableReminder(value);

              if (!value && user._id) {
                try {
                  await deleteMindfulReminder(user._id);
                } catch (error) {
                  console.error('Failed to delete reminder:', error);
                  showToast('Failed to update reminder.', 'error');
                }
              }
            }}
          />

          <SettingsOptionDivider />

          {/* Reminder Settings */}
          {enableReminder && (
            <View style={styles.reminderSettings}>
              <Text style={styles.reminderLabel}>Remind me at</Text>

              {/* Time Selector */}
              <TouchableOpacity
                style={styles.selectorButton}
                onPress={showTimePicker}>
                <Text style={styles.selectorText}>{formatTime()}</Text>
                <SvgChevronDown width={20} height={20} />
              </TouchableOpacity>

              {/* Frequency Selector */}
              <TouchableOpacity
                style={styles.selectorButton}
                onPress={showFrequencyModal}>
                <Text style={styles.selectorText}>{frequency}</Text>
                <SvgChevronDown width={20} height={20} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TimePickerModal
          isVisible={isTimePickerVisible}
          onClose={closeTimePicker}
          onConfirm={handleTimeConfirm}
          selectedHour={selectedHour}
          selectedMinute={selectedMinute}
        />

        <NotificationModal
          isVisible={isFrequencyModalVisible}
          onClose={hideFrequencyModal}
          onConfirm={handleMindfulReminderUpdate}
          frequencyOptions={frequencyOptions}
          selectedFrequency={frequency}
          onSelectFrequency={handleFrequencySelect}
        />
      </View>
    </Container>
  );
};

export default MindfulReminder;
