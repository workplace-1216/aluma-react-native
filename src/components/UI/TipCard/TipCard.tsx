import React from 'react';
import {View, Text} from 'react-native';
import {styles} from './styles';

interface TipCardProps {
  title: string;
  content: string;
}

const TipCard: React.FC<TipCardProps> = ({title, content}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
    </View>
  );
};

export default TipCard;
