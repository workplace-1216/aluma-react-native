type PauseCallback = () => void;

class AudioController {
  private callbacks = new Set<PauseCallback>();

  registerPause(callback: PauseCallback): () => void {
    this.callbacks.add(callback);
    return () => {
      this.callbacks.delete(callback);
    };
  }

  pauseAll(): void {
    this.callbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        // swallow pause errors to avoid crashing other listeners
      }
    });
  }
}

export const audioController = new AudioController();
