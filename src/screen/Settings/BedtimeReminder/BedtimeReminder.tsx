import React, {useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {goBack} from '../../../navigation/AppNavigator';
import Container from '../../../components/layout/Container';
import {SvgChevronDown} from '../../../assets/svg';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {styles} from './styles';
import {useAppSelector} from '../../../redux/store';
import {getBedtimeReminder} from '../../../service/notifications/bedtimeReminder';
import {getFcmToken} from '../../../utils/getFcmToken';
import {updateBedtimeReminder} from '../../../service/notifications/updateBedtimeReminder';
import {deleteBedtimeReminder} from '../../../service/notifications/deleteBedtimeReminder';
import showToast from '../../../components/UI/CustomToast/CustomToast';
import NotificationModal from '../../../components/Modals/NotficationModal';
import {HeaderWithBack} from '../../../components/UI/HeaderWithBack';
import {SettingsOptionItem} from '../../../components/UI/SettingsOptionItem';
import {SettingsOptionDivider} from '../../../components/UI/SettingsOptionDivider';

const BedtimeReminder: React.FC = () => {
  const didMountRef = useRef(false);
  const user = useAppSelector(state => state.user);
  const [enableReminder, setEnableReminder] = useState<boolean | null>(null);
  const [selectedHour, setSelectedHour] = useState(10);
  const [selectedMinute, setSelectedMinute] = useState(50);
  const [selectedAmPm, setSelectedAmPm] = useState('AM');
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
    const formattedMinute =
      selectedMinute < 10 ? `0${selectedMinute}` : selectedMinute;
    return `${selectedHour}:${formattedMinute} ${selectedAmPm}`;
  };

  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimePicker = async (time: string = '') => {
    if (time !== '') {
      try {
        let days: string;
        switch (frequency.toLowerCase()) {
          case 'every day':
            days = 'everyday';
            break;
          case 'week days':
            days = 'weekdays';
            break;
          case 'weekends':
            days = 'weekend';
            break;
          default:
            days = '';
        }
        const fcmToken = await getFcmToken();

        const body = {
          userId: user._id,
          time: time,
          timezone: timezone,
          days: days,
          fcmToken: fcmToken,
        };

        await updateBedtimeReminder(body);
      } catch (error) {
        console.error('Time update failed:', error);
        showToast('Failed to update time.', 'error');
      }
    }

    setTimePickerVisible(false);
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

  const handleBedtimeReminderUpdate = async () => {
    if (enableReminder === null) {return;}

    let hour;
    if (selectedAmPm === 'PM' && selectedHour !== 12) {
      hour = selectedHour + 12;
    } else if (selectedAmPm === 'AM' && selectedHour === 12) {
      hour = 0;
    } else {
      hour = selectedHour;
    }
    const time = `${hour}:${selectedMinute}`;

    let days: string;
    switch (frequency.toLowerCase()) {
      case 'every day':
        days = 'everyday';
        break;
      case 'week days':
        days = 'weekdays';
        break;
      case 'weekends':
        days = 'weekend';
        break;
      default:
        days = '';
    }
    const fcmToken = await getFcmToken();

    const body = {
      userId: user._id,
      time: time,
      timezone: timezone,
      days: days,
      fcmToken: fcmToken,
    };
    await updateBedtimeReminder(body);
  };

  useEffect(() => {
    if (didMountRef.current && isDataLoaded && enableReminder !== null) {
      handleBedtimeReminderUpdate();
    } else {
      didMountRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableReminder]);

  const fetchBedtimeReminderData = async () => {
    if (user._id) {
      try {
        const response = await getBedtimeReminder(user._id);

        if (response?.success && response?.reminder) {
          const {time, days} = response.reminder;

          // Parse time
          const [hourStr, minuteStr] = time.split(':');
          let hour = parseInt(hourStr, 10);
          const minute = parseInt(minuteStr, 10);
          const amPm = hour >= 12 ? 'PM' : 'AM';
          hour = hour % 12 === 0 ? 12 : hour % 12;

          // Set values
          setEnableReminder(true);
          setSelectedHour(hour);
          setSelectedMinute(minute);
          setSelectedAmPm(amPm);

          // Map backend `days` value to the UI frequency string
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
      }
    }
  };

  useEffect(() => {
    fetchBedtimeReminderData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Container>
      <View style={styles.container}>
        <HeaderWithBack title={'Notifications'} onBack={handleBack} />

        <View style={styles.content}>
          <SettingsOptionItem
            title="Bedtime Reminder"
            hasToggle
            toggleValue={!!enableReminder}
            onToggleChange={async value => {
              setEnableReminder(value);

              if (!value && user._id) {
                try {
                  await deleteBedtimeReminder(user._id);
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

        {/* Custom Time Picker Modal */}
        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={date => {
            const hour = date.getHours();
            const minute = date.getMinutes();
            setSelectedHour(hour % 12 === 0 ? 12 : hour % 12);
            setSelectedMinute(minute);
            setSelectedAmPm(hour >= 12 ? 'PM' : 'AM');
            hideTimePicker(`${hour}:${minute}`);
          }}
          onCancel={hideTimePicker}
        />

        <NotificationModal
          isVisible={isFrequencyModalVisible}
          onClose={hideFrequencyModal}
          onConfirm={handleBedtimeReminderUpdate}
          frequencyOptions={frequencyOptions}
          selectedFrequency={frequency}
          onSelectFrequency={handleFrequencySelect}
        />
      </View>
    </Container>
  );
};

export default BedtimeReminder;
