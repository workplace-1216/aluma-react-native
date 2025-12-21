import {Toast} from 'react-native-toast-notifications';
import {styles} from './styles';

type ToastType = 'success' | 'error' | 'info';
type Placement = 'top' | 'bottom' | 'center';

const showToast = (
  message: string,
  type: ToastType = 'success',
  placement: Placement = 'top',
) => {
  let toastType = 'normal';
  let containerStyle = styles.successContainer;
  let textStyle = styles.message;

  if (type === 'success') {
    toastType = 'success';
    containerStyle = styles.successContainer;
    textStyle = styles.message;
  } else if (type === 'error') {
    toastType = 'normal';
    containerStyle = styles.errorContainer;
    textStyle = styles.errorMessage;
  } else if (type === 'info') {
    toastType = 'normal';
    containerStyle = styles.infoContainer;
    textStyle = styles.infoMessage;
  }

  Toast.show(message, {
    type: toastType,
    placement,
    animationType: 'zoom-in',
    style: containerStyle,
    textStyle,
  });
};

export default showToast;
