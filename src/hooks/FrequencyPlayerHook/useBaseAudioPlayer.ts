import {useEffect, useMemo, useCallback, useRef, useState} from 'react';
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
import {
  createPlayerId,
  logAudioEvent,
  markPlaybackStart,
  trackPlayerCreation,
  trackPlayerDestruction,
} from '../../services/audio/devAudioLogger';
import {requireOnline} from '../../services/network/networkState';

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

export function useBaseAudioPlayer({
  routeName = 'unknown',
}: {
  routeName?: string;
} = {}): UseBaseAudioPlayerResult {
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
  const initialAutoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const allInOneSessionActiveRef = useRef(false);
  const playerInstanceIdRef = useRef<string | null>(null);
  const isLoadingRef = useRef(false);
  const playRequestIdRef = useRef(0);

  // ✅ Flag para impedir auto-resume após pausa manual
  const userPausedRef = useRef(false);

  // React state
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentFrequency = queue[currentIndex];
  const currentAudioUrl = useMemo(() => {
    return currentFrequency?.default_audio_file || null;
  }, [currentFrequency]);

  const shouldLoop = !isAllInOneMode && queue.length <= 1;

  const getAudioContext = () => ({
    route: routeName,
    moodId: currentFrequency?.mood_id,
    trackId: currentFrequency?._id,
    trackUrl: currentAudioUrl ?? undefined,
    playerId: playerInstanceIdRef.current ?? undefined,
  });

  const logContextAction = (
    action: string,
    payload?: Record<string, unknown>,
    callsite?: string,
  ) => {
    const context = getAudioContext();
    logAudioEvent({
      action,
      payload,
      callsite,
      route: context.route,
      moodId: context.moodId,
      trackId: context.trackId,
      trackUrl: context.trackUrl,
      playerId: context.playerId,
    });
  };

  const releaseCurrentPlayer = (details?: Record<string, unknown>) => {
    const currentPlayerId = playerInstanceIdRef.current;
    if (currentPlayerId) {
      trackPlayerDestruction(currentPlayerId, routeName, details);
      playerInstanceIdRef.current = null;
    }
  };

  const clearInitialAutoPlayTimeout = () => {
    if (initialAutoPlayTimeoutRef.current) {
      clearTimeout(initialAutoPlayTimeoutRef.current);
      initialAutoPlayTimeoutRef.current = null;
    }
  };

  const stopCurrentSound = (reason: string) => {
    logContextAction(
      'stopCurrentSound',
      {reason},
      'useBaseAudioPlayer.stopCurrentSound',
    );

    if (soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current?.release();
        soundRef.current = null;
        releaseCurrentPlayer({reason});
      });
      isPlayingRef.current = false;
      setIsPlaying(false);
      stopPositionTracking();
    } else {
      releaseCurrentPlayer({reason});
    }

    isLoadingRef.current = false;
  };

  const createSoundFromUrl = (
    url: string,
    callsite: string,
    onReady: (
      sound: Sound,
      playerId: string,
      requestId: number,
    ) => void,
  ) => {
    const requestId = ++playRequestIdRef.current;
    const attemptPlayerId = createPlayerId();
    logContextAction(
      'creatingSoundInstance',
      {requestId},
      callsite,
    );
    stopCurrentSound('preparingNewSound');
    isLoadingRef.current = true;

    if (
      !requireOnline({
        actionName: 'streaming',
        showMessage: false,
      })
    ) {
      isLoadingRef.current = false;
      return;
    }

    const sound = new Sound(url, undefined, error => {
      isLoadingRef.current = false;

      if (requestId !== playRequestIdRef.current) {
        logContextAction(
          'soundLoadStale',
          {
            requestId,
            currentRequestId: playRequestIdRef.current,
          },
          callsite,
        );
        sound.release();
        return;
      }

      if (error) {
        logContextAction(
          'soundLoadError',
          {
            error: (error as Error)?.message ?? 'unknown',
            playerId: attemptPlayerId,
            requestId,
          },
          callsite,
        );
        console.log('Failed to load the sound', error);
        sound.release();
        return;
      }

      onReady(
        sound,
        attemptPlayerId,
        requestId,
      );
    });
  };

  // Desbloqueia autoplay quando um novo all-in-one é iniciado (sem afetar pausa manual fora dele)
  useEffect(() => {
    if (isAllInOneMode && !allInOneSessionActiveRef.current) {
      userPausedRef.current = false;
      autoPlayTriggeredRef.current = false;
      allInOneSessionActiveRef.current = true;
    } else if (!isAllInOneMode) {
      allInOneSessionActiveRef.current = false;
    }
  }, [isAllInOneMode]);

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
      if (!currentAudioUrl && soundRef.current) {
        stopCurrentSound('frequencyCleanup');
        logContextAction(
          'frequencyCleanup',
          {reason: 'audioUrlRemoved'},
          'useBaseAudioPlayer.handleFrequencyCleanup',
        );
        positionRef.current = 0;
        durationRef.current = 0;
        setPosition(0);
        setDuration(0);
        isInitializedRef.current = false;
        autoPlayTriggeredRef.current = false;
        screenLoadedRef.current = false;
      }
    };

    handleFrequencyCleanup();
  }, [currentAudioUrl, stopPositionTracking]);

  // Setup audio when audio URL changes
  useEffect(() => {
    const setupAudio = async () => {
      logContextAction(
        'setupAudioTriggered',
        {queueLength: queue.length},
        'useBaseAudioPlayer.setupAudio',
      );

      if (!currentAudioUrl) {
        logContextAction(
          'setupAudioSkipped',
          {reason: 'noAudioUrl'},
          'useBaseAudioPlayer.setupAudio',
        );
        console.log('No audio URL, skipping setup');
        setIsPlaying(false);
        return;
      }

      autoPlayTriggeredRef.current = false;
      logContextAction(
        'setupAudioReset',
        undefined,
        'useBaseAudioPlayer.setupAudio',
      );

      createSoundFromUrl(
        currentAudioUrl,
        'useBaseAudioPlayer.setupAudio',
        (sound, attemptPlayerId) => {
          soundRef.current = sound;
          const dur = sound.getDuration() * 1000; // ms
          durationRef.current = dur;
          setDuration(dur);
          sound.setVolume(1);
          sound.setNumberOfLoops(-1); // Infinite loop
          isInitializedRef.current = true;
          playerInstanceIdRef.current = attemptPlayerId;

          trackPlayerCreation({
            playerId: attemptPlayerId,
            route: routeName,
            moodId: currentFrequency?.mood_id,
            trackId: currentFrequency?._id,
            trackUrl: currentAudioUrl ?? undefined,
          });

          logContextAction(
            'soundReady',
            {duration: dur},
            'useBaseAudioPlayer.setupAudio',
          );

          if (!autoPlayTriggeredRef.current && !userPausedRef.current) {
            autoPlayTriggeredRef.current = true;
            isPlayingRef.current = true;
            setIsPlaying(true);
            logContextAction(
              'autoPlayStarting',
              {queueIndex: currentIndex},
              'useBaseAudioPlayer.setupAudio.autoPlay',
            );
            markPlaybackStart({
              route: routeName,
              playerId: attemptPlayerId,
              moodId: currentFrequency?.mood_id,
              trackId: currentFrequency?._id,
              trackUrl: currentAudioUrl ?? undefined,
              callsite: 'useBaseAudioPlayer.setupAudio.autoPlay',
            });
            sound.play(success => {
              if (!success) {
                logContextAction(
                  'autoPlayFailed',
                  undefined,
                  'useBaseAudioPlayer.setupAudio.autoPlay',
                );
                console.log('Playback failed');
                isPlayingRef.current = false;
                setIsPlaying(false);
              }
            });

            onPlayStart();
            startPositionTracking();
          }
        },
      );
    };

    setupAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAudioUrl, startPositionTracking, stopPositionTracking]);

  // Auto-play quando a tela carrega (respeitando pause manual)
  useEffect(() => {
    if (!currentAudioUrl || screenLoadedRef.current || userPausedRef.current) {
      return;
    }

    screenLoadedRef.current = true;
    const scheduledUrl = currentAudioUrl;
    logContextAction(
      'initialAutoPlayScheduled',
      {scheduledUrl},
      'useBaseAudioPlayer.initialAutoPlay',
    );

    if (initialAutoPlayTimeoutRef.current) {
      clearTimeout(initialAutoPlayTimeoutRef.current);
    }

    initialAutoPlayTimeoutRef.current = setTimeout(() => {
      if (
        scheduledUrl !== currentAudioUrl || // fila mudou
        !soundRef.current ||
        !isInitializedRef.current ||
        isPlayingRef.current ||
        userPausedRef.current
      ) {
        const guardReason =
          scheduledUrl !== currentAudioUrl
            ? 'urlChanged'
            : !soundRef.current
              ? 'soundMissing'
              : !isInitializedRef.current
                ? 'notInitialized'
                : isPlayingRef.current
                  ? 'alreadyPlaying'
                  : 'userPaused';
        logContextAction(
          'initialAutoPlayGuarded',
          {reason: guardReason},
          'useBaseAudioPlayer.initialAutoPlay',
        );
        return;
      }

      isPlayingRef.current = true;
      setIsPlaying(true);
      logContextAction(
        'initialAutoPlayStarting',
        undefined,
        'useBaseAudioPlayer.initialAutoPlay',
      );
      markPlaybackStart({
        route: routeName,
        playerId: playerInstanceIdRef.current ?? undefined,
        moodId: currentFrequency?.mood_id,
        trackId: currentFrequency?._id,
        trackUrl: currentAudioUrl ?? undefined,
        callsite: 'useBaseAudioPlayer.initialAutoPlay',
      });
      soundRef.current.play(success => {
        if (!success) {
          console.log('Initial auto-play failed');
          isPlayingRef.current = false;
          setIsPlaying(false);
        }
      });
      startPositionTracking();
    }, 500);

    return () => {
      if (initialAutoPlayTimeoutRef.current) {
        clearTimeout(initialAutoPlayTimeoutRef.current);
        initialAutoPlayTimeoutRef.current = null;
      }
    };
  }, [currentAudioUrl, startPositionTracking]);

  // Controls
  const play = async () => {
    try {
      logContextAction('playRequested', undefined, 'useBaseAudioPlayer.play');
      userPausedRef.current = false;
      clearInitialAutoPlayTimeout();

      if (
        !requireOnline({
          actionName: 'reprodução',
          showMessage: true,
        })
      ) {
        return;
      }

      if (isLoadingRef.current) {
        logContextAction(
          'playIgnoredWhileLoading',
          undefined,
          'useBaseAudioPlayer.play',
        );
        return;
      }

      if (!soundRef.current) {
        logContextAction('playNoSoundInstance', undefined, 'useBaseAudioPlayer.play');
        setIsPlaying(false);

        if (currentAudioUrl) {
          createSoundFromUrl(
            currentAudioUrl,
            'useBaseAudioPlayer.play',
            (sound, attemptPlayerId) => {
              soundRef.current = sound;
              const dur = sound.getDuration() * 1000;
              durationRef.current = dur;
              setDuration(dur);
              sound.setVolume(1);
              sound.setNumberOfLoops(-1);
              playerInstanceIdRef.current = attemptPlayerId;

              trackPlayerCreation({
                playerId: attemptPlayerId,
                route: routeName,
                moodId: currentFrequency?.mood_id,
                trackId: currentFrequency?._id,
                trackUrl: currentAudioUrl ?? undefined,
              });

              logContextAction(
                'playSoundReady',
                {duration: dur},
                'useBaseAudioPlayer.play',
              );

              isPlayingRef.current = true;
              setIsPlaying(true);
              markPlaybackStart({
                route: routeName,
                playerId: attemptPlayerId,
                moodId: currentFrequency?.mood_id,
                trackId: currentFrequency?._id,
                trackUrl: currentAudioUrl ?? undefined,
                callsite: 'useBaseAudioPlayer.play',
              });
              sound.play(success => {
                if (!success) {
                  logContextAction(
                    'playSoundFailed',
                    undefined,
                    'useBaseAudioPlayer.play',
                  );
                  console.log('Playback failed');
                  isPlayingRef.current = false;
                  setIsPlaying(false);
                }
              });

              onPlayStart();
              startPositionTracking();
            },
          );
        }
        return;
      }

      if (!isPlayingRef.current) {
        logContextAction(
          'playExistingSound',
          {reason: 'wasPaused'},
          'useBaseAudioPlayer.play',
        );
        isPlayingRef.current = true;
        setIsPlaying(true);
        markPlaybackStart({
          route: routeName,
          playerId: playerInstanceIdRef.current ?? undefined,
          moodId: currentFrequency?.mood_id,
          trackId: currentFrequency?._id,
          trackUrl: currentAudioUrl ?? undefined,
          callsite: 'useBaseAudioPlayer.play',
        });
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
      logContextAction(
        'playError',
        {error: (error as Error)?.message ?? 'unknown'},
        'useBaseAudioPlayer.play',
      );
      console.log('Play error:', error);
    }
  };

  const pauseMusic = async () => {
    try {
      logContextAction(
        'pauseRequested',
        undefined,
        'useBaseAudioPlayer.pauseMusic',
      );
      userPausedRef.current = true;

      if (soundRef.current && isPlayingRef.current) {
        soundRef.current.pause();
        isPlayingRef.current = false;
        setIsPlaying(false);
        stopPositionTracking();
        logContextAction(
          'pauseExecuted',
          undefined,
          'useBaseAudioPlayer.pauseMusic',
        );
      } else {
        isPlayingRef.current = false;
        setIsPlaying(false);
        logContextAction(
          'pauseSkipped',
          {reason: 'alreadyPaused'},
          'useBaseAudioPlayer.pauseMusic',
        );
      }
      onPlayStop();
    } catch (error) {
      logContextAction(
        'pauseError',
        {error: (error as Error)?.message ?? 'unknown'},
        'useBaseAudioPlayer.pauseMusic',
      );
      console.log('Pause error:', error);
    }
  };

  pauseHandlerRef.current = () => {
    void pauseMusic();
  };

  const goToNextFrequency = useCallback(async () => {
    logContextAction(
      'goToNextFrequency',
      {
        currentIndex,
        queueLength: queue.length,
      },
      'useBaseAudioPlayer.goToNextFrequency',
    );
    logContextAction(
      'goToNextFrequencyStoppingCurrent',
      undefined,
      'useBaseAudioPlayer.goToNextFrequency',
    );
    stopCurrentSound('goToNextFrequency');
    stop();

    if (currentIndex + 1 < queue.length) {
      logContextAction(
        'goToNextFrequencyAdvance',
        {nextIndex: currentIndex + 1},
        'useBaseAudioPlayer.goToNextFrequency',
      );
      dispatch(setCurrentIndex(currentIndex + 1));
      if (isAllInOneMode && frequencyDuration > 0) {
        startBackgroundTimer(frequencyDuration, () => {
          console.log('Timer completed for frequency:', currentIndex + 1);
        });
      }
    } else {
      // Last frequency case
      logContextAction(
        'goToNextFrequencyLast',
        {isAllInOneMode},
        'useBaseAudioPlayer.goToNextFrequency',
      );
      if (isAllInOneMode) {
        const lastFrequency = queue[queue.length - 1];
        stopBackgroundTimer();

        if (lastFrequency) {
          dispatch(completeAllInOneSession());

        dispatch(setFrequencyQueue([lastFrequency]));
        dispatch(setCurrentIndex(0));

        setTimeout(() => {
          logContextAction(
            'goToNextFrequencyRestartingSession',
            undefined,
            'useBaseAudioPlayer.goToNextFrequency',
          );
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
      logContextAction(
        'timerCompleted',
        {
          isAllInOneMode,
          shouldLoop,
        },
        'useBaseAudioPlayer.timerEffect',
      );
      if (isAllInOneMode) {
        logContextAction(
          'timerAdvancesQueue',
          undefined,
          'useBaseAudioPlayer.timerEffect',
        );
        goToNextFrequency();
      } else if (shouldLoop) {
        logContextAction(
          'timerLoopsCurrentTrack',
          undefined,
          'useBaseAudioPlayer.timerEffect',
        );
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
        logContextAction(
          'timerCompletesSingleTrack',
          undefined,
          'useBaseAudioPlayer.timerEffect',
        );
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
        logContextAction(
          'sleepTimerStoppingAudio',
          undefined,
          'useBaseAudioPlayer.sleepTimer',
        );
        stopCurrentSound('sleepTimer');
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
    if (!isInitializedRef.current) {
      return;
    }

    logContextAction(
      'syncEffect',
      {isRunning, isPlaying: isPlayingRef.current},
      'useBaseAudioPlayer.timerSync',
    );

    if (!isRunning && isPlayingRef.current) {
      logContextAction(
        'syncEffectPausing',
        undefined,
        'useBaseAudioPlayer.timerSync',
      );
      pauseMusic();
    } else if (
      isRunning &&
      !isPlayingRef.current &&
      currentAudioUrl &&
      !userPausedRef.current
    ) {
      logContextAction(
        'syncEffectResuming',
        undefined,
        'useBaseAudioPlayer.timerSync',
      );
      play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, currentAudioUrl]);

  useEffect(() => {
    logContextAction(
      'registeringPauseCallback',
      undefined,
      'useBaseAudioPlayer.audioController',
    );
    const unregister = audioController.registerPause(() => {
      pauseHandlerRef.current();
    });
    return () => {
      logContextAction(
        'unregisteringPauseCallback',
        undefined,
        'useBaseAudioPlayer.audioController',
      );
      unregister();
    };
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      clearInitialAutoPlayTimeout();
      stopCurrentSound('cleanup');
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
