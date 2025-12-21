import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {styles} from './styles';
import {SettingsOptionDivider} from '../SettingsOptionDivider';
import {SvgChevronRight} from '../../../assets/svg';
import CustomSwitch from '../CustomSwitch';

type Props = {
  title: string;
  onPress?: () => void;
  showDivider?: boolean;
  hasRightArrow?: boolean;
  hasToggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?:
    | ((a: boolean) => void)
    | ((a: boolean) => {})
    | ((a: boolean) => null);
  isToggleLoading?: boolean;
};

const SettingsOptionItem: React.FC<Props> = ({
  title,
  onPress = null,
  showDivider,
  hasRightArrow = false,
  hasToggle = false,
  toggleValue = false,
  onToggleChange = (_: boolean) => {},
  isToggleLoading = false,
}) => {
  return (
    <>
      <TouchableOpacity
        style={[
          styles.menuItem,
          hasRightArrow || hasToggle ? styles.itemWithElement : {},
        ]}
        onPress={onPress}>
        <Text style={styles.menuText}>{title}</Text>
        {hasRightArrow && (
          <SvgChevronRight width={36} height={36} opacity={0.5} />
        )}
        {hasToggle && (
          <CustomSwitch
            value={toggleValue}
            onValueChange={onToggleChange}
            activeTrackColor="#81b0ff"
            inactiveTrackColor="#767577"
            activeThumbColor="#f4f3f4"
            inactiveThumbColor="#f4f3f4"
            isLoading={isToggleLoading}
            loadingColor="#1c3048"
          />
        )}
      </TouchableOpacity>
      {showDivider && <SettingsOptionDivider />}
    </>
  );
};

export default SettingsOptionItem;
