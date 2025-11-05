import { RouteProp } from '@react-navigation/native';

export type WeatherResponse = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  rain?: {
    '1h': number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

export type Unit = 'celsius' | 'fahrenheit';

export interface WeatherState {
  unit: Unit;
}

export type RootStackParamList = {
  DetailScreen: {
    city: string;
    weatherData: WeatherResponse;
  };
};

export type WeatherScreenRouteProp = RouteProp<
  RootStackParamList,
  'DetailScreen'
>;

export interface SuggestionItemProps {
  item: string;
  onSelect: (city: string) => void;
}

export type BreathworkExercise = {
  _id: string;
  title: string;
  description: string;
  steps: number[];
  created_at: Date;
  updated_at: Date;
};
export interface Mood {
  _id: string; // ObjectId
  name: string;
  description: string;
  icon_url: string;
  gradient: string[]; // Array of strings (probably for color codes)
  frequnecy: Frequency[];
  created_at: Date;
  updated_at: Date;
}
export interface Frequency {
  _id: string; // ObjectId
  mood_id: string; // ObjectId (reference to a Mood)
  frequency_value: number;
  title: string;
  description: string;
  detailed_information: string;
  background_image: string;
  background_image_night: string;
  moodWheelItem: MoodWheelItem[];
  created_at: Date;
  updated_at: Date;
}

export interface MoodWheelItem {
  _id: string; // ObjectId
  frequency_id: string; // ObjectId (reference to Frequency)
  quadrant: number;
  title: string;
  audio_url: string;
  thumbnail_url: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface VoiceGuide {
  _id: string;
  tutor_id: null | {
    _id: string;
    name: string;
  };
  exercise_id: {
    _id: string;
    title: string;
  };
  recording: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface QUADRANTS {
  _id: string;
  quadrant: number;
  title: string;
  description: string;
  audio_url: string;
}
export type SubscriptionPlan = 'monthly' | 'yearly';

export interface PlanCard {
  id: SubscriptionPlan;
  title: string;
  price: string;
  features: string[];
}

export interface TutorResponse {
  _id: string;
  name: string;
  bio: string;
  profile_picture: string;
}
