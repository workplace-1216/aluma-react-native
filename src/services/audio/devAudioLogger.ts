type PlaybackStartInfo = {
  time: number;
  moodId?: string;
  trackId?: string;
  trackUrl?: string;
  playerId?: string;
};

const SESSION_ID = `audio-dev-${Date.now().toString(36)}-${Math.random()
  .toString(36)
  .slice(2, 8)}`;

const PLAYER_COLLISION_WINDOW_MS = 500;
const activePlayerInstances = new Set<string>();
let lastPlaybackStart: PlaybackStartInfo | null = null;

const formatPayload = (payload?: Record<string, unknown>): string => {
  if (!payload) {
    return '{}';
  }
  try {
    return JSON.stringify(payload);
  } catch (error) {
    return '{\"error\":\"unserializable payload\"}';
  }
};

const simplifyStack = (stack?: string): string | undefined => {
  if (!stack) {
    return undefined;
  }
  const lines = stack.split('\n').slice(1, 4);
  return lines.map(line => line.trim()).join(' | ');
};

export type AudioDevLogOptions = {
  action: string;
  payload?: Record<string, unknown>;
  route?: string;
  moodId?: string;
  trackId?: string;
  trackUrl?: string;
  playerId?: string;
  callsite?: string;
  stack?: string;
};

export const logAudioEvent = (options: AudioDevLogOptions): void => {
  if (!__DEV__) {
    return;
  }

  const timestamp = Date.now();
  const base = [
    '[AUDIO][DEV]',
    `ts=${timestamp}`,
    `session=${SESSION_ID}`,
    `action=${options.action}`,
    `route=${options.route ?? 'unknown'}`,
    `player=${options.playerId ?? 'none'}`,
    `mood=${options.moodId ?? 'unknown'}`,
    `track=${options.trackId ?? options.trackUrl ?? 'unknown'}`,
  ].join(' ');

  const callsite = options.callsite ? `callsite=${options.callsite}` : undefined;
  const payload = `payload=${formatPayload(options.payload)}`;
  const stack = options.stack ? `stack=${simplifyStack(options.stack)}` : undefined;

  console.log(
    [base, callsite, payload, stack].filter(Boolean).join(' '),
  );
};

export const createPlayerId = (): string =>
  `player-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const trackPlayerCreation = (params: {
  playerId: string;
  route?: string;
  moodId?: string;
  trackId?: string;
  trackUrl?: string;
}): void => {
  if (!__DEV__) {
    return;
  }

  activePlayerInstances.add(params.playerId);
  logAudioEvent({
    action: 'playerCreated',
    playerId: params.playerId,
    route: params.route,
    moodId: params.moodId,
    trackId: params.trackId,
    trackUrl: params.trackUrl,
    payload: {
      activePlayers: Array.from(activePlayerInstances),
    },
    callsite: 'devAudioLogger.trackPlayerCreation',
  });

  if (activePlayerInstances.size === 2) {
    logAudioEvent({
      action: 'multiplePlayerInstances',
      route: params.route,
      payload: {
        count: activePlayerInstances.size,
      },
      callsite: 'devAudioLogger.trackPlayerCreation',
      stack: new Error().stack,
    });
  }
};

export const trackPlayerDestruction = (
  playerId: string,
  route?: string,
  payload?: Record<string, unknown>,
): void => {
  if (!__DEV__) {
    return;
  }

  activePlayerInstances.delete(playerId);
  logAudioEvent({
    action: 'playerDestroyed',
    playerId,
    route,
    payload: {
      remaining: activePlayerInstances.size,
      ...payload,
    },
    callsite: 'devAudioLogger.trackPlayerDestruction',
  });
};

export const markPlaybackStart = (params: {
  route?: string;
  playerId?: string;
  moodId?: string;
  trackId?: string;
  trackUrl?: string;
  callsite?: string;
}): void => {
  if (!__DEV__) {
    return;
  }

  const now = Date.now();
  const info: PlaybackStartInfo = {
    time: now,
    moodId: params.moodId,
    trackId: params.trackId,
    trackUrl: params.trackUrl,
    playerId: params.playerId,
  };

  logAudioEvent({
    action: 'playbackStart',
    route: params.route,
    playerId: params.playerId,
    moodId: params.moodId,
    trackId: params.trackId,
    trackUrl: params.trackUrl,
    callsite: params.callsite,
    payload: {},
  });

  if (
    lastPlaybackStart &&
    now - lastPlaybackStart.time <= PLAYER_COLLISION_WINDOW_MS &&
    (lastPlaybackStart.moodId !== params.moodId ||
      lastPlaybackStart.trackId !== params.trackId ||
      lastPlaybackStart.trackUrl !== params.trackUrl)
  ) {
    logAudioEvent({
      action: 'playbackCollisionDetected',
      route: params.route,
      callsite: 'devAudioLogger.markPlaybackStart',
      payload: {
        previous: lastPlaybackStart,
        current: info,
        window: PLAYER_COLLISION_WINDOW_MS,
      },
      stack: new Error().stack,
    });
  }

  lastPlaybackStart = info;
};

export const logListenerChange = (params: {
  listenerName: string;
  action: 'add' | 'remove' | 'fire';
  route?: string;
  payload?: Record<string, unknown>;
}): void => {
  logAudioEvent({
    action: `listener:${params.listenerName}:${params.action}`,
    route: params.route,
    payload: params.payload,
    callsite: `devAudioLogger.logListenerChange`,
  });
};
