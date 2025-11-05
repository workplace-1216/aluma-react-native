import React, {useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {goBack} from '../../../navigation/AppNavigator';
import Container from '../../../components/layout/Container';
import {SvgChevronDown} from '../../../assets/svg';
import DateTimePickerModal, {
  CancelButton,
  CustomCancelButtonPropTypes,
} from 'react-native-modal-datetime-picker';
import {styles} from './styles';
import {getMindfulReminder} from '../../../service/notifications/mindfulReminder';
import {useAppSelector} from '../../../redux/store';
import {getFcmToken} from '../../../utils/getFcmToken';
import {updateMindfulReminder} from '../../../service/notifications/updateMindfulReminder';
import showToast from '../../../components/UI/CustomToast/CustomToast';
import {deleteMindfulReminder} from '../../../service/notifications/deleteMindfulReminder';
import NotificationModal from '../../../components/Modals/NotficationModal';
import {HeaderWithBack} from '../../../components/UI/HeaderWithBack';
import {SettingsOptionItem} from '../../../components/UI/SettingsOptionItem';
import {SettingsOptionDivider} from '../../../components/UI/SettingsOptionDivider';

const MindfulReminder: React.FC = () => {
  const user = useAppSelector(state => state.user);
  const didMountRef = useRef(false);

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
  const CustomCancelButton: React.FC<CustomCancelButtonPropTypes> = props => (
    <View style={{marginBottom: 15}}>
      <CancelButton {...props} />
    </View>
  );

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

        await updateMindfulReminder(body);
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

  const handleMindfulReminderUpdate = async () => {
    if (enableReminder === null) {return;}

    try {
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
      await updateMindfulReminder(body);
    } catch (error) {
      console.error('Reminder update failed:', error);
      showToast('Failed to update reminder.', 'error');
    }
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
          const amPm = hour >= 12 ? 'PM' : 'AM';
          hour = hour % 12 === 0 ? 12 : hour % 12;

          setEnableReminder(true);
          setSelectedHour(hour);
          setSelectedMinute(minute);
          setSelectedAmPm(amPm);

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

        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={async date => {
            const hour = date.getHours();
            const minute = date.getMinutes();
            setSelectedHour(hour % 12 === 0 ? 12 : hour % 12);
            setSelectedMinute(minute);
            setSelectedAmPm(hour >= 12 ? 'PM' : 'AM');
            await hideTimePicker(`${hour}:${minute}`);
          }}
          onCancel={hideTimePicker}
          customCancelButtonIOS={CustomCancelButton}
          pickerContainerStyleIOS={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
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
