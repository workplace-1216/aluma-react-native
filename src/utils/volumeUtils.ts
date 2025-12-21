const MIN_EFFECTIVE_VOLUME = 0.2;

/**
 * Clamp user-selected volume (0..1) to an effective floor so audio nunca zera.
 */
export const toEffectiveVolume = (volume?: number): number => {
  const normalized = typeof volume === 'number' ? volume : 1;
  return Math.max(MIN_EFFECTIVE_VOLUME, Math.min(1, normalized));
};

export {MIN_EFFECTIVE_VOLUME};
