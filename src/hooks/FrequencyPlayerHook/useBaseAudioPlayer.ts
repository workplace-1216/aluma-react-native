import {useEffect, useMemo, useCallback, useRef, useState} from 'react';
import {AppState} from 'react-native';
import Sound from 'react-native-sound';
import {useDispatch} from 'react-redux';
import useCountdown from '../CountdownHook';
import {useAppSelector} from '../../redux/store';
import {
  setCurrentIndex,
  completeAllInOneSession,
  setFrequencyQueue,
} from '../../redux/slice/frequencyQueueSlice';
import {FREQUENCY} from '../../redux/slice/moodSlice';
import {
  startBackgroundTimer,
  stopBackgroundTimer,
} from '../CountdownHook/backgroundTimerService.ts';
import {useSleepCountdown} from '../SleepCountdown/SleepCountdownHook.ts';
import {useGlobalMusicTimer} from './useGlobalMusicTimer.ts';
import {audioController} from '../../services/audio/AudioController';

export interface UseBaseAudioPlayerResult {
  currentFrequency: FREQUENCY | undefined;
  isLastFrequency: boolean;

  isPlaying: boolean;
  position: number;
  duration: number;
  play: () => Promise<void>;
  pauseMusic: () => Promise<void>;
  isRunning: boolean;
  timeLeft: number;
  goToNextFrequency: () => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
}

export function useBaseAudioPlayer(): UseBaseAudioPlayerResult {
  // Recomendado ligar uma vez no bootstrap, manter aqui é seguro:
  Sound.setCategory('Playback', true);

  const dispatch = useDispatch();
  const {onPlayStart, onPlayStop} = useGlobalMusicTimer();

  // Redux state
  const queue = useAppSelector(state => state.frequencyQueue.queue);
  const currentIndex = useAppSelector(
    state => state.frequencyQueue.currentIndex,
  );
  const isAllInOneMode = useAppSelector(
    state => state.frequencyQueue.isAllInOneMode,
  );
  const frequencyDuration = useAppSelector(
    state => state.frequencyQueue.frequencyDuration,
  );
  const nightMode = useAppSelector(state => state.nightMode);

  // Timer hook
  const {timeLeft, isRunning, restart, pause, resume, stop} = useCountdown();
  const {timeLeft: sleepTimerLeft, isRunning: sleepTimerIsRunning} =
    useSleepCountdown();

  // Sound state (refs)
  const soundRef = useRef<Sound | null>(null);
  const isPlayingRef = useRef(false);
  const positionRef = useRef(0);
  const durationRef = useRef(0);
  const positionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);
  const autoPlayTriggeredRef = useRef(false);
  const screenLoadedRef = useRef(false);
  const sleepTimerWasRunningRef = useRef(false);
  const pauseHandlerRef = useRef<() => void>(() => {});

  // ✅ Flag para impedir auto-resume após pausa manual
  const userPausedRef = useRef(false);

  // React state
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentFrequency = queue[currentIndex];
  const nightModeFrequency = nightMode?.frequency[0];

  const currentAudioUrl = useMemo(() => {
    if (nightMode?.isNightMode) {
      return nightModeFrequency?.default_audio_file || null;
    }
    return currentFrequency?.default_audio_file || null;

  }, [currentFrequency, nightModeFrequency, nightMode?.isNightMode]);

  const shouldLoop = !isAllInOneMode && queue.length <= 1;

  // Position tracking
  const startPositionTracking = useCallback(() => {
    if (positionIntervalRef.current) {
      clearInterval(positionIntervalRef.current);
    }

    positionIntervalRef.current = setInterval(() => {
      if (soundRef.current && isPlayingRef.current) {
        soundRef.current.getCurrentTime((seconds: number) => {
          positionRef.current = seconds * 1000; // ms
          setPosition(positionRef.current);
        });
      }
    }, 250);
  }, []);

  const stopPositionTracking = useCallback(() => {
    if (positionIntervalRef.current) {
      clearInterval(positionIntervalRef.current);
      positionIntervalRef.current = null;
    }
  }, []);

  // Initialize timer for all-in-one mode
  useEffect(() => {
    if (isAllInOneMode && frequencyDuration > 0) {
      startBackgroundTimer(frequencyDuration, () => {
        console.log('Timer completed for frequency:', currentIndex);
      });
    }
  }, [isAllInOneMode, frequencyDuration, currentIndex]);

  // Cleanup when audio URL disappears
  useEffect(() => {
    const handleFrequencyCleanup = async () => {
      if (!currentAudioUrl) {
        if (soundRef.current) {
          soundRef.current.stop(() => {
            soundRef.current?.release();
            soundRef.current = null;
          });
          isPlayingRef.current = false;
          setIsPlaying(false);
          positionRef.current = 0;
          durationRef.current = 0;
          setPosition(0);
          setDuration(0);
          stopPositionTracking();
          isInitializedRef.current = false;
          autoPlayTriggeredRef.current = false;
          screenLoadedRef.current = false;
        }
      }
    };

    handleFrequencyCleanup();
  }, [currentAudioUrl, stopPositionTracking]);

  // Setup audio when audio URL changes
  useEffect(() => {
    const setupAudio = async () => {
      if (!currentAudioUrl) {
        console.log('No audio URL, skipping setup');
        setIsPlaying(false);
        return;
      }

      try {
        autoPlayTriggeredRef.current = false;

        // Stop and release existing sound
        if (soundRef.current) {
          soundRef.current.stop(() => {
            soundRef.current?.release();
            soundRef.current = null;
          });
          isPlayingRef.current = false;
          setIsPlaying(false);
          stopPositionTracking();
        }

        // Create new sound
        const sound = new Sound(currentAudioUrl, undefined, error => {
          if (error) {
            console.log('Failed to load the sound', error);
            return;
          }

          soundRef.current = sound;
          const dur = sound.getDuration() * 1000; // ms
          durationRef.current = dur;
          setDuration(dur);

          // 🔊 Volume da instância = 1; volume real é do SISTEMA
          sound.setVolume(1);
          sound.setNumberOfLoops(-1); // Infinite loop
          isInitializedRef.current = true;

          // Auto-play somente se o usuário não pausou manualmente
          if (!autoPlayTriggeredRef.current && !userPausedRef.current) {
            autoPlayTriggeredRef.current = true;
            isPlayingRef.current = true;
            setIsPlaying(true);
            sound.play(success => {
              if (!success) {
                console.log('Playback failed');
                isPlayingRef.current = false;
                setIsPlaying(false);
              }
            });

            onPlayStart();
            startPositionTracking();
          }
        });
      } catch (error) {
        console.log('Sound setup error:', error);
      }
    };

    setupAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentAudioUrl,
    nightMode?.isNightMode,
    startPositionTracking,
    stopPositionTracking,
  ]);

  // Auto-play quando a tela carrega (respeitando pause manual)
  useEffect(() => {
    const handleInitialAutoPlay = () => {
      if (currentAudioUrl && !screenLoadedRef.current && !userPausedRef.current) {
        screenLoadedRef.current = true;

        setTimeout(() => {
          if (
            soundRef.current &&
            isInitializedRef.current &&
            !isPlayingRef.current
          ) {
            isPlayingRef.current = true;
            setIsPlaying(true);
            soundRef.current.play(success => {
              if (!success) {
                console.log('Initial auto-play failed');
                isPlayingRef.current = false;
                setIsPlaying(false);
              }
            });
            startPositionTracking();
          }
        }, 500);
      }
    };

    handleInitialAutoPlay();
  }, [currentAudioUrl, startPositionTracking]);

  // Controls
  const play = async () => {
    try {
      // usuário explicitamente quer tocar novamente
      userPausedRef.current = false;

      if (!soundRef.current) {
        if (currentAudioUrl) {
          setIsPlaying(false);
          const sound = new Sound(currentAudioUrl, undefined, error => {
            if (error) {
              console.log('Failed to load the sound', error);
              return;
            }

            soundRef.current = sound;
            const dur = sound.getDuration() * 1000;
            durationRef.current = dur;
            setDuration(dur);

            // 🔊 instância sempre em 1 (volume real é o do dispositivo)
            sound.setVolume(1);
            sound.setNumberOfLoops(-1);

            isPlayingRef.current = true;
            setIsPlaying(true);
            sound.play(success => {
              if (!success) {
                console.log('Playback failed');
                isPlayingRef.current = false;
                setIsPlaying(false);
              }
            });

            onPlayStart();
            startPositionTracking();
          });
        }
        return;
      }

      if (!isPlayingRef.current) {
        isPlayingRef.current = true;
        setIsPlaying(true);
        soundRef.current.play(success => {
          if (!success) {
            console.log('Play failed');
            isPlayingRef.current = false;
            setIsPlaying(false);
          }
        });

        onPlayStart();
        startPositionTracking();
      }
    } catch (error) {
      console.log('Play error:', error);
    }
  };

  const pauseMusic = async () => {
    try {
      // marca pausa do usuário para bloquear auto-resume
      userPausedRef.current = true;

      if (soundRef.current && isPlayingRef.current) {
        soundRef.current.pause();
        isPlayingRef.current = false;
        setIsPlaying(false);
        stopPositionTracking();
      } else {
        // ensure UI stays in-sync
        isPlayingRef.current = false;
        setIsPlaying(false);
      }
      onPlayStop();
    } catch (error) {
      console.log('Pause error:', error);
    }
  };

  pauseHandlerRef.current = () => {
    void pauseMusic();
  };

  const goToNextFrequency = useCallback(async () => {
    if (soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current?.release();
        soundRef.current = null;
      });
      isPlayingRef.current = false;
      setIsPlaying(false);
      stopPositionTracking();
    }
    stop();

    if (currentIndex + 1 < queue.length) {
      dispatch(setCurrentIndex(currentIndex + 1));
      if (isAllInOneMode && frequencyDuration > 0) {
        startBackgroundTimer(frequencyDuration, () => {
          console.log('Timer completed for frequency:', currentIndex + 1);
        });
      }
    } else {
      // Last frequency case
      if (isAllInOneMode) {
        const lastFrequency = queue[queue.length - 1];
        stopBackgroundTimer();

        if (lastFrequency) {
          dispatch(completeAllInOneSession());

          dispatch(setFrequencyQueue([lastFrequency]));
          dispatch(setCurrentIndex(0));

          setTimeout(() => {
            // ao iniciar de novo explicitamente, limpamos a flag de pausa
            userPausedRef.current = false;
            play();
          }, 150);
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentIndex,
    queue.length,
    queue,
    isAllInOneMode,
    frequencyDuration,
    dispatch,
    stop,
    stopPositionTracking,
  ]);

  // Handle timer end
  useEffect(() => {
    if (timeLeft === 0 && !isRunning) {
      if (isAllInOneMode) {
        goToNextFrequency();
      } else if (shouldLoop) {
        restart();
        if (soundRef.current) {
          soundRef.current.setCurrentTime(0);
          if (!isPlayingRef.current && !userPausedRef.current) {
            isPlayingRef.current = true;
            soundRef.current.play(success => {
              if (!success) {
                isPlayingRef.current = false;
                setIsPlaying(false);
              }
            });
            startPositionTracking();
          }
        }
      } else {
        goToNextFrequency();
      }
    }
  }, [
    timeLeft,
    isRunning,
    isAllInOneMode,
    shouldLoop,
    restart,
    goToNextFrequency,
    startPositionTracking,
  ]);

  // Track if sleep timer was ever running
  useEffect(() => {
    if (sleepTimerIsRunning) {
      sleepTimerWasRunningRef.current = true;
    }
  }, [sleepTimerIsRunning]);

  useEffect(() => {
    const handleSleepTimerEnd = () => {
      if (soundRef.current) {
        soundRef.current.stop(() => {
          soundRef.current?.release();
          soundRef.current = null;
        });
        isPlayingRef.current = false;
        setIsPlaying(false);
        stopPositionTracking();
        sleepTimerWasRunningRef.current = false;
      }
    };

    if (
      sleepTimerLeft === 0 &&
      !sleepTimerIsRunning &&
      sleepTimerWasRunningRef.current
    ) {
      handleSleepTimerEnd();
    }
  }, [sleepTimerLeft, sleepTimerIsRunning, stopPositionTracking]);

  // Sync timer and player (respeita pausa manual)
  useEffect(() => {
    if (!isInitializedRef.current) {return;}

    if (!isRunning && isPlayingRef.current) {
      // timer parou -> pausamos
      pauseMusic();
    } else if (isRunning && !isPlayingRef.current && currentAudioUrl && !userPausedRef.current) {
      // timer rodando, som parado e usuário NÃO pausou manualmente -> play
      play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, currentAudioUrl]);

  useEffect(() => {
    const unregister = audioController.registerPause(() => {
      pauseHandlerRef.current();
    });
    return unregister;
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', status => {
      if (status === 'background' || status === 'inactive') {
        pauseHandlerRef.current();
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.stop(() => {
          soundRef.current?.release();
          soundRef.current = null;
        });
      }
      stopPositionTracking();
    };
  }, [stopPositionTracking]);

  return {
    currentFrequency: currentFrequency,
    isLastFrequency: currentIndex === queue.length - 1,
    isPlaying,
    position,
    duration,
    timeLeft,
    isRunning,
    play,
    pause,
    resume,
    stop,
    pauseMusic,
    goToNextFrequency,
  };
}
