import React, {useState, useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  Text,
  View,
  Platform,
  Button,
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
  showCloseButton?: boolean;
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
  showCloseButton = true,
}: BottomSheetProps) => {
  const refRBSheet = useRef<RBSheetRef>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleClose = () => {
    if (!disableClose && open) {
      onClose();
    }
  };

  useEffect(() => {
    if (open) {
      const openSheet = () => {
        if (refRBSheet.current) {
          console.log(
            '[BottomSheet] Opening on',
            Platform.OS,
            'height:',
            height,
          );
          try {
            refRBSheet.current.open();
            console.log('[BottomSheet] open() called successfully');
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 500,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }).start();
          } catch (error) {
            console.error('[BottomSheet] Error calling open():', error);
          }
        } else {
          console.warn('[BottomSheet] Ref not ready, retrying...');
          // Retry for Android - ref might not be ready immediately
          if (Platform.OS === 'android') {
            setTimeout(openSheet, 200);
          } else {
            setTimeout(openSheet, 100);
          }
        }
      };

      // Android needs more time for the ref to be ready
      const delay = Platform.OS === 'android' ? 2000 : 50;
      setTimeout(openSheet, delay);
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        if (refRBSheet.current) {
          refRBSheet.current.close();
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Debug: Log height value
  useEffect(() => {
    if (open && Platform.OS === 'android') {
      console.log('[BottomSheet] Android - height prop:', height);
    }
  }, [open, height]);
  return (
    <View>
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
          wrapper: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            ...(Platform.OS === 'android' && {
              elevation: 24,
              zIndex: 9999,
            }),
          },
          container: {
            backgroundColor: '#113D56', // Red for Android testing
            borderTopLeftRadius: 37,
            borderTopRightRadius: 37,
            overflow: 'hidden',
            ...(Platform.OS === 'android' && {
              elevation: 25,
              zIndex: 10000,
              minHeight: height || 300,
              width: '100%',
              opacity: 1,
            }),
          },
        }}>
        <LinearGradient
          colors={['#1E2746', '#113D56', '#045466']}
          style={[
            styles.modalView,
            styles.gradientContainer,
            Platform.OS === 'android' && {
              position: 'relative',
              flex: 1,
            },
          ]}
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
                  !showCloseButton && styles.headerNoCloseButton,
                ]}>
                {showCloseButton ? (
                  <View style={styles.closeButtonContainer}>
                    <Pressable
                      onPress={handleClose}
                      style={styles.closeButton}
                      disabled={disableClose}>
                      <Text
                        style={[styles.close, disableClose && {opacity: 0}]}>
                        X
                      </Text>
                    </Pressable>
                  </View>
                ) : (
                  <View style={styles.closeButtonPlaceholder} />
                )}

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
    </View>
  );
};

export default BottomSheet;
