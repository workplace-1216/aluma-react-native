import {useCallback, useRef, useEffect, useState} from 'react';
import Sound from 'react-native-sound';
import {FREQUENCY} from '../../redux/slice/moodSlice';
import {useGlobalMusicTimer} from './useGlobalMusicTimer';
import {audioController} from '../../services/audio/AudioController';
import {toEffectiveVolume} from '../../utils/volumeUtils';
import {
  createPlayerId,
  logAudioEvent,
  markPlaybackStart,
  trackPlayerCreation,
  trackPlayerDestruction,
} from '../../services/audio/devAudioLogger';

export interface UseQuadrantAudioPlayerResult {
  playQuadrant: (url: string) => void;
  stopQuadrant: () => void;
  setVolume: (volume: number) => void; // per-track (relativo ao sistema)
  isQuadrantPlaying: boolean;
  currentQuadrantUrl: string | null;
}

/**
 * Player de quadrantes:
 * - Volume real é o do SISTEMA (dispositivo).
 * - Mantemos "per-track" (0..1) só para balancear o quadrante relativo ao sistema (opcional).
 */
export function useQuadrantAudioPlayer(
  currentFrequency: FREQUENCY | undefined,
  nightMode: boolean,
  volumeFromPreferences: number = 1,
): UseQuadrantAudioPlayerResult {
  const {onPlayStart, onPlayStop} = useGlobalMusicTimer();

  const lastQuadrantUrlRef = useRef<string | null>(null);
  const isQuadrantPlayingRef = useRef(false);
  const soundInstanceRef = useRef<Sound | null>(null);
  const perTrackRef = useRef<number>(toEffectiveVolume(volumeFromPreferences));
  const playerInstanceIdRef = useRef<string | null>(null);
  const quadrantRouteName = 'Home';

  const getQuadrantContext = () => ({
    route: quadrantRouteName,
    playerId: playerInstanceIdRef.current ?? undefined,
    trackUrl: lastQuadrantUrlRef.current ?? undefined,
  });

  const logQuadrantEvent = (
    action: string,
    payload?: Record<string, unknown>,
    callsite?: string,
  ) => {
    const context = getQuadrantContext();
    logAudioEvent({
      action,
      payload,
      callsite,
      route: context.route,
      playerId: context.playerId,
      trackUrl: context.trackUrl,
    });
  };

  const releaseQuadrantPlayer = (details?: Record<string, unknown>) => {
    const currentPlayerId = playerInstanceIdRef.current;
    if (currentPlayerId) {
      trackPlayerDestruction(currentPlayerId, quadrantRouteName, details);
      playerInstanceIdRef.current = null;
    }
  };

  const [isQuadrantPlaying, setIsQuadrantPlaying] = useState(false);

  // Atualiza per-track quando preferência muda (relativo ao sistema)
  useEffect(() => {
    const v = toEffectiveVolume(volumeFromPreferences);
    perTrackRef.current = v;
    if (soundInstanceRef.current && isQuadrantPlayingRef.current) {
      try {
        soundInstanceRef.current.setVolume(v);
      } catch (e) {
        // ignore volume sync errors
      }
    }
  }, [volumeFromPreferences]);

  // Categoria (só 1 argumento para evitar TS error)
  useEffect(() => {
    try {
      Sound.setCategory('Playback');
    } catch (e) {
      // ignore category setup issues
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    const v = toEffectiveVolume(volume);
    perTrackRef.current = v;
    if (soundInstanceRef.current) {
      try {
        soundInstanceRef.current.setVolume(v);
      } catch (e) {
        // ignore per-track volume errors
      }
    }
  }, []);

  const playQuadrant = useCallback(async (url: string) => {
    if (!url) {return;}

    logQuadrantEvent(
      'quadrantPlayRequested',
      {url},
      'useQuadrantAudioPlayer.playQuadrant',
    );

    try {
      if (lastQuadrantUrlRef.current === url) {
        if (soundInstanceRef.current) {
          soundInstanceRef.current.stop(() => {});
          soundInstanceRef.current?.release();
          soundInstanceRef.current = null;
          releaseQuadrantPlayer({reason: 'toggleSameUrl'});
        }
        logQuadrantEvent(
          'quadrantStoppingSameUrl',
          undefined,
          'useQuadrantAudioPlayer.playQuadrant',
        );
        onPlayStop();
        lastQuadrantUrlRef.current = null;
        isQuadrantPlayingRef.current = false;
        setIsQuadrantPlaying(false);
        return;
      }

      if (soundInstanceRef.current) {
        logQuadrantEvent(
          'quadrantStoppingPrevious',
          undefined,
          'useQuadrantAudioPlayer.playQuadrant',
        );
        soundInstanceRef.current.stop(() => {
          soundInstanceRef.current?.release();
          soundInstanceRef.current = null;
          releaseQuadrantPlayer({reason: 'newUrl'});
        });
        isQuadrantPlayingRef.current = false;
        onPlayStop();
        setIsQuadrantPlaying(false);
      }

      onPlayStart();
      const attemptPlayerId = createPlayerId();
      logQuadrantEvent(
        'quadrantCreatingSound',
        {playerId: attemptPlayerId},
        'useQuadrantAudioPlayer.playQuadrant',
      );

      const sound = new Sound(url, undefined, error => {
        if (error) {
          logQuadrantEvent(
            'quadrantSoundLoadError',
            {
              error: (error as Error)?.message ?? 'unknown',
              playerId: attemptPlayerId,
            },
            'useQuadrantAudioPlayer.playQuadrant',
          );
          isQuadrantPlayingRef.current = false;
          setIsQuadrantPlaying(false);
          onPlayStop();
          releaseQuadrantPlayer({reason: 'loadError'});
          return;
        }

        try { sound.setVolume(perTrackRef.current); } catch (e) { /* ignore */ }
        try { sound.setNumberOfLoops(-1); } catch (e) { /* ignore */ }
        try { sound.setCategory('Playback'); } catch (e) { /* ignore */ }

        playerInstanceIdRef.current = attemptPlayerId;
        trackPlayerCreation({
          playerId: attemptPlayerId,
          route: quadrantRouteName,
          trackUrl: url,
        });
        logQuadrantEvent(
          'quadrantSoundReady',
          undefined,
          'useQuadrantAudioPlayer.playQuadrant',
        );

        markPlaybackStart({
          route: quadrantRouteName,
          playerId: attemptPlayerId,
          trackUrl: url,
          callsite: 'useQuadrantAudioPlayer.playQuadrant',
        });

        sound.play(success => {
          if (success) {
            isQuadrantPlayingRef.current = true;
            setIsQuadrantPlaying(true);
          } else {
            logQuadrantEvent(
              'quadrantPlayFailed',
              undefined,
              'useQuadrantAudioPlayer.playQuadrant',
            );
            isQuadrantPlayingRef.current = false;
            setIsQuadrantPlaying(false);
            onPlayStop();
            sound.release();
            releaseQuadrantPlayer({reason: 'playbackFailed'});
          }
        });
      });

      soundInstanceRef.current = sound;
      lastQuadrantUrlRef.current = url;
    } catch (error) {
      logQuadrantEvent(
        'quadrantPlayError',
        {error: (error as Error)?.message ?? 'unknown'},
        'useQuadrantAudioPlayer.playQuadrant',
      );
      isQuadrantPlayingRef.current = false;
      setIsQuadrantPlaying(false);
      onPlayStop();
    }
  }, [onPlayStart, onPlayStop]);

  const stopQuadrant = useCallback(() => {
    try {
      logQuadrantEvent(
        'stopQuadrantRequested',
        undefined,
        'useQuadrantAudioPlayer.stopQuadrant',
      );
      if (soundInstanceRef.current) {
        soundInstanceRef.current.stop(() => {
          soundInstanceRef.current?.release();
          soundInstanceRef.current = null;
          releaseQuadrantPlayer({reason: 'stopQuadrant'});
        });
      }
      onPlayStop();
      lastQuadrantUrlRef.current = null;
      isQuadrantPlayingRef.current = false;
      setIsQuadrantPlaying(false);
    } catch (error) {
      logQuadrantEvent(
        'stopQuadrantError',
        {error: (error as Error)?.message ?? 'unknown'},
        'useQuadrantAudioPlayer.stopQuadrant',
      );
    }
  }, [onPlayStop]);

  // Stop quadrant when frequency changes
  useEffect(() => {
    if (!currentFrequency) {
      stopQuadrant();
    }
  }, [currentFrequency, stopQuadrant]);

  // Stop quadrant when night mode changes
  useEffect(() => {
    stopQuadrant();
  }, [nightMode, stopQuadrant]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopQuadrant();
    };
  }, [stopQuadrant]);

  useEffect(() => {
    logQuadrantEvent(
      'registeringPauseCallback',
      undefined,
      'useQuadrantAudioPlayer.audioController',
    );
    const unregister = audioController.registerPause(() => {
      stopQuadrant();
    });
    return () => {
      logQuadrantEvent(
        'unregisteringPauseCallback',
        undefined,
        'useQuadrantAudioPlayer.audioController',
      );
      unregister();
    };
  }, [stopQuadrant]);

  return {
    playQuadrant,
    stopQuadrant,
    setVolume,
    isQuadrantPlaying,
    currentQuadrantUrl: lastQuadrantUrlRef.current,
  };
}
