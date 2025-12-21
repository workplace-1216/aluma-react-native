import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {goBack} from '../../../navigation/AppNavigator';
import Container from '../../../components/layout/Container';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import colors from '../../../assets/colors';
import {styles} from './styles';
import {updateUser} from '../../../service/auth/updateUser';
import {setUser} from '../../../redux/slice/userSlice';
import showToast from '../../../components/UI/CustomToast/CustomToast';
import {HeaderWithBack} from '../../../components/UI/HeaderWithBack';

const EditUserInfo: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);

  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [email, setEmail] = useState(user.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const handleBack = () => {
    goBack();
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    // Validate first name
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    // Validate last name
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        firstName,
        lastName,
        email,
      };

      const updatedUser = await updateUser(user._id, userData);

      // Update Redux state
      dispatch(
        setUser({
          ...user,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
        }),
      );

      showToast('Your information has been updated successfully');
      goBack();
    } catch (error: any) {
      console.error('Error updating user info:', error);

      showToast(
        error?.data?.message ||
          'Failed to update your information. Please try again.',
        'error',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <HeaderWithBack title={'Edit Information'} onBack={handleBack} />

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.formContainer}>
            {/* First Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.firstName ? styles.inputError : null,
                ]}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                placeholderTextColor="#a0a9b8"
              />
              {errors.firstName ? (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              ) : null}
            </View>

            {/* Last Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.lastName ? styles.inputError : null,
                ]}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                placeholderTextColor="#a0a9b8"
              />
              {errors.lastName ? (
                <Text style={styles.errorText}>{errors.lastName}</Text>
              ) : null}
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={[
                  styles.emailInput,
                  errors.email ? styles.inputError : null,
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#a0a9b8"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={false}
              />
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isLoading}>
              {isLoading ? (
                <>
                  <Text style={styles.submitButtonText}>Saving</Text>
                  <ActivityIndicator color={colors.WHITE} />
                </>
              ) : (
                <Text style={styles.submitButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default EditUserInfo;
