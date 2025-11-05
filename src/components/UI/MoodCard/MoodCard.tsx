import React, {useCallback} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {styles} from './styles';
import {navigate} from '../../../navigation/AppNavigator';
import routes from '../../../constants/routes';
import {MOOD} from '../../../redux/slice/moodSlice';

// Evita re-render se prop "mood" não mudou
type MoodCardProps = {
  mood: MOOD;
};

const MoodCardComponent: React.FC<MoodCardProps> = ({mood}) => {
  const {name, icon_url, _id} = mood;

  // depende só do id e do próprio mood (imutável via redux)
  const navigateMood = useCallback(() => {
    navigate(routes.MOOD, {data: mood});
  }, [_id, mood]);

  return (
    <TouchableOpacity onPress={navigateMood} style={styles.card}>
      <View style={styles.titleView}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {name}
        </Text>
      </View>
      <FastImage
        source={{uri: icon_url, priority: FastImage.priority.normal}}
        style={styles.circle}
        resizeMode={FastImage.resizeMode.cover}
      />
    </TouchableOpacity>
  );
};

export default React.memo(MoodCardComponent, (prev, next) => prev.mood._id === next.mood._id);
