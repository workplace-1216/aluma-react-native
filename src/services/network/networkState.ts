import showToast from '../../components/UI/CustomToast/CustomToast';

export type NetworkStatus = {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  lastChangeTime: number;
};

const DEFAULT_STATUS: NetworkStatus = {
  isConnected: true,
  isInternetReachable: true,
  lastChangeTime: Date.now(),
};

let currentStatus: NetworkStatus = DEFAULT_STATUS;

export const getNetworkStatus = (): NetworkStatus => currentStatus;

export const updateNetworkStatus = (status: Partial<NetworkStatus>) => {
  currentStatus = {
    ...currentStatus,
    ...status,
    lastChangeTime: Date.now(),
  };
  return currentStatus;
};

export type RequireOnlineOptions = {
  actionName?: string;
  showMessage?: boolean;
};

export const requireOnline = (options?: RequireOnlineOptions): boolean => {
  const {showMessage = false} = options ?? {};
  const {isConnected, isInternetReachable} = currentStatus;
  const online = isConnected && isInternetReachable !== false;

  if (!online && showMessage) {
    showToast('Internet connection required', 'error', 'top');
  }

  return online;
};
