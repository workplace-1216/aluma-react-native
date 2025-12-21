import {useState, useRef, useEffect, useCallback} from 'react';
import Sound from 'react-native-sound';

// Only plays when app is in foreground (e.g., 'Ambient')
Sound.setCategory('Ambient', false); // allowMixWithOthers = false

type UseSoundReturn = {
  play: () => void;
  pause: () => void;
  stop: () => void;
  clear: () => void;
  isPlaying: boolean;
  isLoaded: boolean;
  error: string | null;
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const VoiceGuideSound = (
  url: string | undefined,
  volume: number = 1,
): UseSoundReturn => {
  const soundRef = useRef<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const volumeRef = useRef(clamp01(volume));

  const loadSound = useCallback(() => {
    if (!url) {return;}

    if (soundRef.current) {
      soundRef.current.release();
      soundRef.current = null;
    }

    const isRemote = url.startsWith('http://') || url.startsWith('https://');

    const sound = new Sound(
      url,
      isRemote ? undefined : Sound.MAIN_BUNDLE,
      err => {
        if (err) {
          setError(`Load error: ${err.message}`);
          setIsLoaded(false);
          return;
        }
        try {
          sound.setVolume(volumeRef.current);
        } catch (e) {
          // ignore volume sync errors
        }
        setIsLoaded(true);
        setError(null);
      },
    );

    soundRef.current = sound;
  }, [url]);

  useEffect(() => {
    const nextVolume = clamp01(volume);
    volumeRef.current = nextVolume;
    if (soundRef.current) {
      try {
        soundRef.current.setVolume(nextVolume);
      } catch (e) {
        // ignore runtime volume errors
      }
    }
  }, [volume]);

  useEffect(() => {
    loadSound();

    // Stop and clean up when unmounting or URL changes
    return () => {
      stop();
      clear();
    };
  }, [loadSound]);

  const play = () => {
    const sound = soundRef.current;
    if (sound && isLoaded) {
      sound.play(success => {
        if (!success) {
          setError('Playback failed');
        }
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const pause = () => {
    const sound = soundRef.current;
    if (sound && isPlaying) {
      sound.pause();
      setIsPlaying(false);
    }
  };

  const stop = () => {
    const sound = soundRef.current;
    if (sound) {
      sound.stop(() => setIsPlaying(false));
    }
  };

  const clear = () => {
    const sound = soundRef.current;
    if (sound) {
      sound.release();
      soundRef.current = null;
    }
    setIsLoaded(false);
    setIsPlaying(false);
  };

  return {
    play,
    pause,
    stop,
    clear,
    isPlaying,
    isLoaded,
    error,
  };
};

export default VoiceGuideSound;
