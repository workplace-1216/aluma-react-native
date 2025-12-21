import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {SvgEyeOff, SvgEyeOpen} from '../../../assets/svg';
import {goBack} from '../../../navigation/AppNavigator';
import Container from '../../../components/layout/Container';
import showToast from '../../../components/UI/CustomToast/CustomToast';
import colors from '../../../assets/colors';
import {styles} from './styles';
import {isPasswordAvailable} from '../../../service/settings/isPassword';
import {setPassword} from '../../../service/settings/updatePassword';
import {HeaderWithBack} from '../../../components/UI/HeaderWithBack';

const SetPassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPassword, setIsPassword] = useState(false);

  const [visible, setVisible] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleToggle = (field: 'old' | 'new' | 'confirm') => {
    setVisible(prev => ({...prev, [field]: !prev[field]}));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    if (isPassword && !oldPassword) {
      newErrors.oldPassword = 'Old password is required';
      isValid = false;
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    const checkPassword = async () => {
      try {
        const response = await isPasswordAvailable();
        setIsPassword(response?.isPasswordSet);
      } catch (error: any) {
        showToast(
          error?.data?.message || 'An error occurred. Please try again.',
          'error',
        );
      } finally {
        // setLoading(false);
      }
    };

    checkPassword();
  }, []);

  const handleSubmit = async () => {
    if (!validateForm()) {return;}
    setIsLoading(true);
    try {
      const payload = isPassword ? {oldPassword, newPassword} : {newPassword};

      await setPassword(payload);
      showToast('Password updated successfully');
      goBack();
    } catch (error: any) {
      console.log(error?.data?.message);
      showToast(
        error?.data?.message || 'An error occurred. Please try again.',
        'error',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <HeaderWithBack title={'Set Password'} onBack={goBack} />
        <ScrollView
          style={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            {/* Old Password */}
            {isPassword && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Old Password</Text>
                <View
                  style={[
                    styles.passwordWrapper,
                    errors.oldPassword && styles.inputError,
                  ]}>
                  <TextInput
                    style={[styles.input, {flex: 1}]}
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    placeholder="Enter old password"
                    placeholderTextColor="#a0a9b8"
                    secureTextEntry={!visible.old}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => handleToggle('old')}>
                    {visible.old ? (
                      <SvgEyeOpen color={colors.WHITE} width={20} height={20} />
                    ) : (
                      <SvgEyeOff color={colors.WHITE} width={20} height={20} />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.oldPassword ? (
                  <Text style={styles.errorText}>{errors.oldPassword}</Text>
                ) : null}
              </View>
            )}

            {/* New Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>New Password</Text>
              <View
                style={[
                  styles.passwordWrapper,
                  errors.newPassword && styles.inputError,
                ]}>
                <TextInput
                  style={[styles.input, {flex: 1}]}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor="#a0a9b8"
                  secureTextEntry={!visible.new}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => handleToggle('new')}>
                  {visible.new ? (
                    <SvgEyeOpen color={colors.WHITE} width={20} height={20} />
                  ) : (
                    <SvgEyeOff color={colors.WHITE} width={20} height={20} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.newPassword ? (
                <Text style={styles.errorText}>{errors.newPassword}</Text>
              ) : null}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View
                style={[
                  styles.passwordWrapper,
                  errors.confirmPassword && styles.inputError,
                ]}>
                <TextInput
                  style={[styles.input, {flex: 1}]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor="#a0a9b8"
                  secureTextEntry={!visible.confirm}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => handleToggle('confirm')}>
                  {visible.confirm ? (
                    <SvgEyeOpen color={colors.WHITE} width={20} height={20} />
                  ) : (
                    <SvgEyeOff color={colors.WHITE} width={20} height={20} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.confirmPassword ? (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              ) : null}
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isLoading}>
              {isLoading ? (
                <>
                  <ActivityIndicator color={colors.WHITE} />
                </>
              ) : (
                <Text style={styles.submitButtonText}>Update Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default SetPassword;
