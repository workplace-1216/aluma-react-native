import {
  logAudioEvent,
  logListenerChange,
} from './devAudioLogger';

type PauseCallback = () => void;

class AudioController {
  private callbacks = new Set<PauseCallback>();

  registerPause(callback: PauseCallback): () => void {
    this.callbacks.add(callback);
    logListenerChange({
      listenerName: 'pauseCallback',
      action: 'add',
      payload: {
        totalListeners: this.callbacks.size,
      },
    });

    return () => {
      this.callbacks.delete(callback);
      logListenerChange({
        listenerName: 'pauseCallback',
        action: 'remove',
        payload: {
          totalListeners: this.callbacks.size,
        },
      });
    };
  }

  pauseAll(): void {
    logAudioEvent({
      action: 'pauseAllTriggered',
      payload: {
        registeredListeners: this.callbacks.size,
      },
      callsite: 'AudioController.pauseAll',
    });

    this.callbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        logAudioEvent({
          action: 'pauseListenerError',
          payload: {
            error: (error as Error)?.message ?? 'unknown error',
          },
          callsite: 'AudioController.pauseAll',
        });
      }
    });
  }
}

export const audioController = new AudioController();
