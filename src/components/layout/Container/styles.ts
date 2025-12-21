import {Platform, StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? '2%' : 0,
  },
});
