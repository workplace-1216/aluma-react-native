import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {ReactNode} from 'react';
import {styles} from './styles';
import images from '../../../../assets/images';
import {SvgCircleArrow} from '../../../../assets/svg';
import {widthToDP} from 'react-native-responsive-screens';
import {isSmallAppleScreen} from '../../../../utils/isSmallAppleScreen';

interface AuthContainerProps {
  description?: string;
  children: ReactNode;
  showFooterBtn?: boolean;
  handlePress?: () => void;
  loading?: boolean;
  buttonText?: string;
  error?: string;
  success?: string;
  navigateForgotPassword?: () => void;
  showForgetPasswordBtn?: boolean;
  signUpPurpose?: boolean;
  email?: string;
  hasErrorBox?: boolean;
}

const AuthContainer = ({
  description,
  children,
  showFooterBtn = false,
  handlePress,
  loading,
  buttonText,
  error,
  success,
  hasErrorBox = true,
  navigateForgotPassword,
  showForgetPasswordBtn = false,
  signUpPurpose = false,
  email,
}: AuthContainerProps) => {
  const renderHeader = () => (
    <View style={styles.headerView}>
      <Text style={styles.HeaderText}>Aluma Breath</Text>
      <Image source={images.Ellipse} style={styles.circleLogo} />
      <Text style={styles.description}>{description}</Text>
    </View>
  );

  const renderErrorBox = () =>
    hasErrorBox ? (
      <View style={styles.messageContainer}>
        {error !== '' && <Text style={styles.errorMessage}>{error}</Text>}
        {success && <Text style={styles.successMessage}>{success}</Text>}
      </View>
    ) : null;

  const renderFooterButtons = () =>
    showFooterBtn ? (
      <TouchableOpacity
        onPress={handlePress}
        style={[
          styles.bottomButton,
          {
            opacity: loading ? 0.6 : 1,
            marginBottom: !description
              ? widthToDP('9.5%')
              : widthToDP('13.95%'),
          },
        ]}
        disabled={!!loading || (!!email && !email.trim())}>
        <Text style={styles.bottomText}>{buttonText}</Text>
        {loading ? (
          <ActivityIndicator
            size="small"
            color="#fff"
            style={{marginLeft: 8}}
          />
        ) : (
          <SvgCircleArrow
            width={widthToDP('4.42%')}
            height={widthToDP('4.42%')}
          />
        )}
      </TouchableOpacity>
    ) : null;

  const renderShowForgetPasswordBtn = () =>
    showForgetPasswordBtn ? (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={navigateForgotPassword}
          style={styles.bottomButton}>
          <Text style={styles.bottomText}>Forgot password</Text>
        </TouchableOpacity>
      </View>
    ) : null;

  return (
    <View style={styles.subContainer}>
      {renderHeader()}
      <View
        style={[
          styles.footerView,
          {
            marginTop: signUpPurpose
              ? isSmallAppleScreen
                ? widthToDP(8)
                : widthToDP(10)
              : isSmallAppleScreen
              ? widthToDP(20)
              : widthToDP(33),
          },
        ]}>
        {renderErrorBox()}
        {children}
      </View>
      {renderFooterButtons()}
      {renderShowForgetPasswordBtn()}
    </View>
  );
};

export default AuthContainer;
