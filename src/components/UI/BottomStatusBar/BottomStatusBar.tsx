import React from 'react';
import {View, Text} from 'react-native';
import {styles} from './styles';
import {useAppSelector} from '../../../redux/store';
interface StatsBarProps {
  bottomLeftCornerQuote: string;
}

const StatsBar: React.FC<StatsBarProps> = ({bottomLeftCornerQuote}) => {
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
        <View style={styles.contentCenter}>
          <Text style={styles.number}>{user?.sessions?.count}</Text>
          <Text style={styles.label}>
            {user?.sessions?.count === 1 ? 'SESSION' : 'SESSIONS'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default StatsBar;
