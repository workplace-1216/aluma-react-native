import axiosInstance from '../axiosInstance';
import {Image} from 'react-native';

const prefetchMoodIcons = (moods?: any[]) => {
  if (!Array.isArray(moods)) {
    return;
  }

  moods.forEach(mood => {
    const url = mood?.icon_url;
    if (typeof url !== 'string' || url.trim().length === 0) {
      return;
    }
    Image.prefetch(url).catch(() => {});
  });
};

export const getMoodsAll = async () => {
  try {
    const response = await axiosInstance.get('/moods/all');
    const data = response.data;
    if (data?.data) {
      prefetchMoodIcons(data.data);
    } else if (Array.isArray(data)) {
      prefetchMoodIcons(data);
    }
    return data;
  } catch (error: any) {
    throw error.response;
  }
};
