import React, {useState, useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {styles} from './styles';
import LinearGradient from 'react-native-linear-gradient';

type BottomSheetProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  height?: number;
  children: React.ReactNode;
  noGutters?: boolean;
  isScrollable?: boolean;
  showHeader?: boolean;
  isHome?: boolean;
  showAvailabilityToggle?: boolean;
  backgroundColor?: string;
  draggable?: boolean;
  disableClose?: boolean;
};

export interface RBSheetRef {
  open: () => void;
  close: () => void;
}

const BottomSheet = ({
  title,
  open,
  onClose,
  children,
  height,
  isScrollable = true,
  noGutters = false,
  showHeader = true,
  showAvailabilityToggle = false,
  draggable = false,
  disableClose = false,
}: BottomSheetProps) => {
  const [, setShow] = useState(false);
  const refRBSheet = useRef<RBSheetRef>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setShow(open);
  }, [open]);

  const handleClose = () => {
    if (!disableClose && open) {
      onClose();
    }
  };

  useEffect(() => {
    if (!refRBSheet.current) {return;}

    if (open) {
      setTimeout(() => {
        refRBSheet.current?.open();
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
      }, 50);
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        refRBSheet.current?.close();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <RBSheet
      openDuration={500}
      ref={refRBSheet}
      onClose={handleClose}
      height={height}
      draggable={draggable && !disableClose}
      dragOnContent={true}
      closeOnPressBack={!disableClose}
      closeOnPressMask={!disableClose}
      customStyles={{
        wrapper: {},
        container: {
          backgroundColor: '#113D56',
          borderTopLeftRadius: 37,
          borderTopRightRadius: 37,
          overflow: 'hidden',
        },
      }}>
      <LinearGradient
        colors={['#1E2746', '#113D56', '#045466']}
        style={[styles.modalView, styles.gradientContainer]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}>
        <View style={styles.contentContainer}>
          {showHeader && (
            <View
              style={[
                styles.row,
                styles.headerWrapper,
                showAvailabilityToggle
                  ? styles.headerWrapperWithToggle
                  : styles.headerWrapperWithoutToggle,
              ]}>
              <View style={styles.closeButtonContainer}>
                <Pressable
                  onPress={handleClose}
                  style={styles.closeButton}
                  disabled={disableClose}>
                  <Text style={[styles.close, disableClose && {opacity: 0}]}>
                    X
                  </Text>
                </Pressable>
              </View>

              <Text style={styles.title}>{title}</Text>
            </View>
          )}

          <ScrollView
            scrollEnabled={isScrollable}
            showsVerticalScrollIndicator={false}
            style={noGutters ? styles.scrollViewNoGutters : styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}>
            {children}
          </ScrollView>
        </View>
      </LinearGradient>
    </RBSheet>
  );
};

export default BottomSheet;
