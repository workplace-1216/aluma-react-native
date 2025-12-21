export const formatSeconds = (totalSeconds: number): string => {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  const padded = secs < 10 ? `0${secs}` : `${secs}`;
  return `${mins}:${padded}`;
};
