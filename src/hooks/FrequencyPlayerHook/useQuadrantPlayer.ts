import {useCallback, useRef, useEffect, useState} from 'react';
import {AppState} from 'react-native';
import Sound from 'react-native-sound';
import {FREQUENCY} from '../../redux/slice/moodSlice';
import {useGlobalMusicTimer} from './useGlobalMusicTimer';
import {audioController} from '../../services/audio/AudioController';

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
  const perTrackRef = useRef<number>(Math.max(0, Math.min(1, volumeFromPreferences)));

  const [isQuadrantPlaying, setIsQuadrantPlaying] = useState(false);

  // Atualiza per-track quando preferência muda (relativo ao sistema)
  useEffect(() => {
    const v = Math.max(0, Math.min(1, volumeFromPreferences));
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
    const v = Math.max(0, Math.min(1, volume));
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

    try {
      if (lastQuadrantUrlRef.current === url) {
        if (soundInstanceRef.current) {
          soundInstanceRef.current.stop(() => {});
          soundInstanceRef.current?.release();
          soundInstanceRef.current = null;
        }
        onPlayStop();
        lastQuadrantUrlRef.current = null;
        isQuadrantPlayingRef.current = false;
        setIsQuadrantPlaying(false);
        return;
      }

      // Sempre parar o anterior antes do novo
      if (soundInstanceRef.current) {
        soundInstanceRef.current.stop(() => {});
        soundInstanceRef.current?.release();
        soundInstanceRef.current = null;
        isQuadrantPlayingRef.current = false;
        onPlayStop();
        setIsQuadrantPlaying(false);
      }

      onPlayStart();

      const sound = new Sound(url, undefined, error => {
        if (error) {
          isQuadrantPlayingRef.current = false;
          setIsQuadrantPlaying(false);
          onPlayStop();
          return;
        }

        // Volume relativo ao sistema (per-track). Sistema decide volume real.
        try { sound.setVolume(perTrackRef.current); } catch (e) { /* ignore */ }
        try { sound.setNumberOfLoops(-1); } catch (e) { /* ignore */ }
        try { sound.setCategory('Playback'); } catch (e) { /* ignore */ }

        sound.play(success => {
          if (success) {
            isQuadrantPlayingRef.current = true;
            setIsQuadrantPlaying(true);
          } else {
            isQuadrantPlayingRef.current = false;
            setIsQuadrantPlaying(false);
            onPlayStop();
            sound.release();
          }
        });
      });

      soundInstanceRef.current = sound;
      lastQuadrantUrlRef.current = url;
    } catch (error) {
      isQuadrantPlayingRef.current = false;
      setIsQuadrantPlaying(false);
      onPlayStop();
    }
  }, [onPlayStart, onPlayStop]);

  const stopQuadrant = useCallback(() => {
    try {
      if (soundInstanceRef.current) {
        soundInstanceRef.current.stop(() => {
          soundInstanceRef.current?.release();
          soundInstanceRef.current = null;
        });
      }
      onPlayStop();
      lastQuadrantUrlRef.current = null;
      isQuadrantPlayingRef.current = false;
      setIsQuadrantPlaying(false);
    } catch (error) {
      // ignore stop errors
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
    const unregister = audioController.registerPause(() => {
      stopQuadrant();
    });
    return unregister;
  }, [stopQuadrant]);

  useEffect(() => {
    const listener = AppState.addEventListener('change', state => {
      if (state === 'background' || state === 'inactive') {
        stopQuadrant();
      }
    });
    return () => {
      listener.remove();
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
