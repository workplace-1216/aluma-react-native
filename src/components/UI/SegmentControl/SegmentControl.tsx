import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';

interface SegmentControlProps {
    segments: string[];
    selectedIndex: number;
    onChange: (index: number) => void;
}

const SegmentControl: React.FC<SegmentControlProps> = ({
    segments,
    selectedIndex,
    onChange,
}) => {
    return (
        <View style={styles.container}>
            {segments.map((segment, index) => {
                const isSelected = selectedIndex === index;
                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => onChange(index)}
                        style={[styles.tab, isSelected && styles.selectedTab]}
                    >
                        <Text style={styles.text}>
                            {segment}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default SegmentControl;
