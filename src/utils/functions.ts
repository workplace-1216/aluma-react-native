import { VoiceGuide } from './types';

export const getVoiceGuideByTutorAndExerciseId = (
  data: VoiceGuide[],
  tutorId: string,
  exerciseId: string
): VoiceGuide | undefined => {
  return data.find(
    (item) =>
      item.tutor_id?._id === tutorId &&
      item.exercise_id._id === exerciseId
  );
};

export function convertToSeconds(value: string): number {
  const num = Number(value);
  return isNaN(num) ? 0 : num * 60;
}

// export const CACHE_TTL_6H = 6 * 60 * 60 * 1000;
export const CACHE_TTL_6H = 15 * 60 * 1000; // 15 minutes for testing
export const needsRefresh = (
  lastUpdated?: number,
  ttl: number = CACHE_TTL_6H,
): boolean => {
  if (!lastUpdated) {
    return true;
  }
  return Date.now() - lastUpdated > ttl;
};
