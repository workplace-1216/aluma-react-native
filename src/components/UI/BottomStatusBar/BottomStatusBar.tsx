import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {styles} from './styles';
import {useAppSelector} from '../../../redux/store';
import hambuguer from "../../../assets/images/hambugersave.png";
import {navigate} from '../../../navigation/AppNavigator';
import routes from '../../../constants/routes';
interface StatsBarProps {
  bottomLeftCornerQuote: string;
  onSavedPress?: () => void;
}

const StatsBar: React.FC<StatsBarProps> = ({bottomLeftCornerQuote, onSavedPress}) => {
  const user = useAppSelector(state => state.user);

  const formatPlayingTime = (seconds: number = 0) => {
    if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      return `${mins}m`;
    } else {
      const hrs = Math.floor(seconds / 3600);
      return `${hrs}h`;
    }
  };

  return (
    <View style={styles.container}>
      {/* Left Section: Quote */}
      <View style={[styles.sectionLeft]}>
        <Text numberOfLines={5} style={styles.quote}>
          {bottomLeftCornerQuote}
        </Text>
      </View>

      {/* Middle Section: Time Today */}
      <View style={[styles.sectionCenter]}>
        <Text style={styles.number}>
          {formatPlayingTime(user?.playingTime?.count || 0)}
        </Text>
        <Text style={styles.label}>TODAY</Text>
      </View>

      {/* Right Section: Total Sessions */}
      <View style={[styles.sectionRight]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.contentCenter}
          onPress={() => {
            if (onSavedPress) {
              onSavedPress();
            } else {
              navigate(routes.SAVED_VIDEOS);
            }
          }}
        >
          <Image
            source={hambuguer}
            style={{ width: 28, height: 28 }}
            resizeMode="contain"
          />
          <Text style={styles.label}>SAVED</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StatsBar;
