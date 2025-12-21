import React from 'react';
import {View, TouchableOpacity, Text, Share, Image} from 'react-native';
import {goBack} from '../../../navigation/AppNavigator';
import {webURL} from '../../../constants/constants';
import showToast from '../../../components/UI/CustomToast/CustomToast';
import Container from '../../../components/layout/Container';
import {styles} from './styles';
import images from '../../../assets/images';
import {HeaderWithBack} from '../../../components/UI/HeaderWithBack';

const InviteFriends: React.FC = () => {
  const handleBack = () => {
    goBack();
  };

  const handleSendInvite = async () => {
    try {
      const result = await Share.share({
        message:
          'Join me on this amazing app for healing frequencies and breath work! Download it now:',
        url: webURL,
        title: 'Join me on this healing journey',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          showToast('Invite sent successfully!');
        } else {
          // shared
          showToast('Invite sent successfully!');
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      showToast('Failed to send invite. Please try again.', 'error');
    }
  };

  return (
    <Container>
      <HeaderWithBack title={'Invite Friends'} onBack={handleBack} />

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image source={images.Logo} style={styles.logo} />
        </View>

        <Text style={styles.titleText}>Share the energy</Text>

        <Text style={styles.subtitleText}>
          Share the healing power of {'\n'}frequencies and breath.
        </Text>

        <TouchableOpacity
          style={styles.inviteButton}
          onPress={handleSendInvite}>
          <Text style={styles.inviteButtonText}>Send Invite</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default InviteFriends;
