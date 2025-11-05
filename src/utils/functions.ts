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
