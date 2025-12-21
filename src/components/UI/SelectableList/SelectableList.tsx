import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from './styles';

interface SelectableListProps {
  options: string[];
  onSelect: (selectedOption: string) => void;
}

const SelectableList: React.FC<SelectableListProps> = ({options, onSelect}) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
    onSelect(option);
  };

  return (
    <View style={styles.container}>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          style={[styles.option]}
          onPress={() => handleSelect(option)}>
          <Text style={styles.text}>{option}</Text>

          <View
            style={[
              styles.circleStyle,
              selected === option && styles.selectedOption,
            ]} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SelectableList;
