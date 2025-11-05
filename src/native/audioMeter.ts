import { NativeModules } from 'react-native';

const RNSound: any = NativeModules.RNSound || {};

export async function enableMeteringFor(soundKey?: number | null, enabled = true) {
  if (!soundKey && soundKey !== 0) {return;}
  if (typeof RNSound.enableMetering === 'function') {
    try { RNSound.enableMetering(soundKey, enabled); } catch {}
  }
}

export type PowerResult = { averageDb: number; peakDb: number };

export async function getPower(soundKey?: number | null): Promise<PowerResult> {
  if (!soundKey && soundKey !== 0) {return { averageDb: -160, peakDb: -160 };}
  if (typeof RNSound.getPower === 'function') {
    try {
      const res = await RNSound.getPower(soundKey);
      return {
        averageDb: typeof res?.averageDb === 'number' ? res.averageDb : -160,
        peakDb: typeof res?.peakDb === 'number' ? res.peakDb : -160,
      };
    } catch { /* noop */ }
  }
  return { averageDb: -160, peakDb: -160 };
}

/** Converte dB (-60..0) para [0..1] */
export function dbToNorm(db: number, floor = -60) {
  if (db < floor) {return 0;}
  if (db > 0) {return 1;}
  return (db - floor) / (0 - floor);
}
