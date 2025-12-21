import React from 'react';
import {View, Text, TouchableOpacity, Modal} from 'react-native';
import {styles} from './styles';
import {BreathworkExercise} from '../../../utils/types';
import {ScrollView} from 'react-native-gesture-handler';

interface SelectionModalProps {
  isModalVisible: boolean;
  title: string;
  setIsModalVisible: (visible: boolean) => void;
  handleSelection: (exercise: BreathworkExercise) => void;
  breathworkSettings: BreathworkExercise[];
  stopQuadrant: () => void;
  pause: () => void;
  timeLeft: number;
  isRunning: boolean;
}

const SelectionModal: React.FC<SelectionModalProps> = ({
  isModalVisible,
  title,
  setIsModalVisible,
  handleSelection,
  breathworkSettings,
  stopQuadrant,
  pause,
  timeLeft,
  isRunning,
}) => {
  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}>
      <TouchableOpacity
        onPress={handleModalClose}
        activeOpacity={1}
        style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.headerView}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={handleModalClose}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}>
            {breathworkSettings?.map((setting, index) => (
              <TouchableOpacity
                key={index}
                style={
                  index === breathworkSettings.length - 1
                    ? styles.settingButtonLast
                    : styles.settingButton
                }
                onPress={async () => {
                  handleSelection(setting);
                  await stopQuadrant();
                  if (timeLeft > 0 && isRunning) {
                    pause();
                  }
                  handleModalClose();
                }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.settingText}>
                  {setting.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default SelectionModal;
