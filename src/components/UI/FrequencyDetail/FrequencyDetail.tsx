import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';
import { Frequency } from '../../../utils/types';



const FrequencyDetail: React.FC<Frequency> = ({ title, description }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.content}>{description}</Text>
        </View>
    );
};

export default FrequencyDetail;
