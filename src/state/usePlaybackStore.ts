import {useEffect, useRef} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {create} from 'zustand';

type PlaybackState = {
  volume: number;
  elapsedSec: number;
  isPlaying: boolean;
  setVolume: (volume: number) => void;
  setPlaying: (playing: boolean) => void;
  tick: () => number;
};

export const usePlaybackStore = create<PlaybackState>((set, get) => ({
  volume: 1,
  elapsedSec: 0,
  isPlaying: false,
  setVolume: volume =>
    set({
      volume: Math.max(0, Math.min(1, volume)),
    }),
  setPlaying: playing => set({isPlaying: playing}),
  tick: () => {
    const next = get().elapsedSec + 1;
    set({elapsedSec: next});
    return next;
  },
}));

/**
 * usePlaybackClock
 * - increments the in-memory elapsed counter every second while playing
 * - flushes accumulated seconds every 60s, when the app backgrounds, and on unmount
 */
export const usePlaybackClock = (
  onFlush: (elapsedSeconds: number) => void,
): void => {
  const onFlushRef = useRef(onFlush);

  useEffect(() => {
    onFlushRef.current = onFlush;
  }, [onFlush]);

  useEffect(() => {
    let isMounted = true;

    const flush = () => {
      if (!isMounted) {
        return;
      }
      const {elapsedSec} = usePlaybackStore.getState();
      if (elapsedSec > 0) {
        onFlushRef.current?.(elapsedSec);
        usePlaybackStore.setState({elapsedSec: 0});
      }
    };

    const interval = setInterval(() => {
      const {isPlaying} = usePlaybackStore.getState();
      if (!isPlaying) {
        return;
      }
      const elapsed = usePlaybackStore.getState().tick();
      if (elapsed >= 60 && elapsed % 60 === 0) {
        flush();
      }
    }, 1000);

    const handleAppState = (status: AppStateStatus) => {
      if (status === 'background' || status === 'inactive') {
        flush();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppState);

    return () => {
      isMounted = false;
      clearInterval(interval);
      subscription.remove();
      flush();
    };
  }, []);
};
