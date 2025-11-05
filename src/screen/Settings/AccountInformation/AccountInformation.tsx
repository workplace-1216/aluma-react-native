import React from 'react';
import {View, TouchableOpacity, Text, Alert} from 'react-native';
import routes from '../../../constants/routes';
import {goBack, navigate, reset} from '../../../navigation/AppNavigator';
import Container from '../../../components/layout/Container';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {resetUser} from '../../../redux/slice/userSlice';
import {deleteUser} from '../../../service/auth/deleteUser';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {styles} from './styles';
import {googleSignOut} from '../../../service/auth/googleSignUp';
import {googleKey} from '../../../constants/constants';
import showToast from '../../../components/UI/CustomToast/CustomToast';
import {HeaderWithBack} from '../../../components/UI/HeaderWithBack';

const AccountInformation: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);

  GoogleSignin.configure({
    webClientId: googleKey,
  });

  const handleBack = () => {
    goBack();
  };

  const handleEditUserInfo = () => {
    navigate(routes.EDIT_USER_INFO);
  };

  const handleSetPassword = () => {
    navigate(routes.SET_PASSWORD);
  };

  const handleEditSubscription = () => {
    navigate(routes.SUBSCRIPTIONS);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser(user._id);
              dispatch(resetUser());
              if (user.googleAccount) {
                await googleSignOut();
              }
              showToast('Your account has been deleted successfully');
              reset(routes.CONNECT);
            } catch (error: any) {
              console.error('Error deleting account:', error);

              showToast(
                error?.data?.message ||
                  'Failed to delete account. Please try again.',
                'error',
              );
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <Container>
      <View style={styles.container}>
        <HeaderWithBack title={'Account Information'} onBack={handleBack} />

        <View style={styles.content}>
          {/* User Information Section */}
          <View style={styles.section}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>First Name</Text>
              <Text style={styles.infoValue}>{user.firstName}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Last Name</Text>
              <Text style={styles.infoValue}>{user.lastName}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>

            <TouchableOpacity onPress={handleEditUserInfo}>
              <Text style={[styles.editButton, {marginBottom: 10}]}>EDIT</Text>
            </TouchableOpacity>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Password</Text>
              <Text style={styles.infoValue}>********</Text>
            </View>

            <TouchableOpacity onPress={handleSetPassword}>
              <Text style={styles.editButton}>EDIT</Text>
            </TouchableOpacity>
          </View>

          {/* Subscription Section */}
          <View style={styles.section}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Subscription Details</Text>
              <Text style={styles.infoValue}>Annual</Text>
            </View>

            <TouchableOpacity onPress={handleEditSubscription}>
              <Text style={styles.editButton}>EDIT</Text>
            </TouchableOpacity>
          </View>

          {/* Delete Account Section */}
          <View style={styles.deleteSection}>
            <View style={styles.infoItem}>
              <Text style={styles.deleteLabel}>Delete Account</Text>
            </View>

            <TouchableOpacity onPress={handleDeleteAccount}>
              <Text style={styles.deleteButton}>DELETE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Container>
  );
};

export default AccountInformation;
