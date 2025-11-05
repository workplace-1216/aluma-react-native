import {useEffect, useRef, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {updatePlayingTime} from '../../redux/slice/userSlice';
import {useAppSelector} from '../../redux/store';
import {usePlaybackClock, usePlaybackStore} from '../../state/usePlaybackStore';

let globalActivePlayersRef = 0;

export function useGlobalMusicTimer() {
  const dispatch = useDispatch();
  const elapsed = useAppSelector(state => state.user.playingTime);

  const elapsedRef = useRef(
    elapsed ?? {
      count: 0,
      lastPlayingTimeDate: undefined,
    },
  );

  useEffect(() => {
    if (!elapsed) {
      elapsedRef.current = {count: 0, lastPlayingTimeDate: undefined};
      return;
    }
    elapsedRef.current = elapsed;
  }, [elapsed]);

  const flush = useCallback(
    (deltaSeconds: number) => {
      if (!deltaSeconds || deltaSeconds <= 0) {
        return;
      }

      const prev = elapsedRef.current ?? {
        count: 0,
        lastPlayingTimeDate: undefined,
      };

      const updated = {
        count: prev.count + deltaSeconds,
        lastPlayingTimeDate:
          prev.lastPlayingTimeDate || new Date().toDateString(),
      };

      elapsedRef.current = updated;
      dispatch(updatePlayingTime(updated));
    },
    [dispatch],
  );

  usePlaybackClock(flush);

  const onPlayStart = useCallback(() => {
    globalActivePlayersRef += 1;
    if (globalActivePlayersRef === 1) {
      usePlaybackStore.getState().setPlaying(true);
    }
  }, []);

  const onPlayStop = useCallback(() => {
    globalActivePlayersRef = Math.max(0, globalActivePlayersRef - 1);
    if (globalActivePlayersRef === 0) {
      usePlaybackStore.getState().setPlaying(false);
    }
  }, []);

  return {
    elapsed,
    onPlayStart,
    onPlayStop,
  };
}
