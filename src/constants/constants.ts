import { Platform } from 'react-native';

const backendURLs = {
  local: 'http://192.168.0.26:6900/v1',
  staging: 'https://breathwork-backend.chillkro.com/v1',
  production: 'https://breathingapp-256e2b219dac.herokuapp.com/v1',
};

export const API_URL = backendURLs.production;

export const webURL = 'https://www.alumabreath.com/';
export const googleKey = Platform.OS === 'android' ?
  '611397085607-t4ho2a541hfnqtrql3douppms2bt5hof.apps.googleusercontent.com' :
  '496393728550-14c0esphlre859tn48rutn7nca8knl5l.apps.googleusercontent.com';
