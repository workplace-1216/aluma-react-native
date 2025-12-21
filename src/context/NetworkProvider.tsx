import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {
  NetworkStatus,
  updateNetworkStatus,
  getNetworkStatus,
} from '../services/network/networkState';

const initialStatus: NetworkStatus = getNetworkStatus();

const NetworkStatusContext = createContext<NetworkStatus>(initialStatus);

export const useNetworkStatus = () => useContext(NetworkStatusContext);

export const NetworkProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [status, setStatus] = useState<NetworkStatus>(initialStatus);

  useEffect(() => {
    let lastOffline = false;

    const onChange = (netInfo: NetInfoState) => {
      const reachable =
        typeof netInfo.isInternetReachable === 'boolean'
          ? netInfo.isInternetReachable
          : null;
      const payload: NetworkStatus = {
        isConnected: netInfo.isConnected ?? false,
        isInternetReachable: reachable,
        lastChangeTime: Date.now(),
      };

      setStatus(payload);
      updateNetworkStatus(payload);

      const isOffline =
        !payload.isConnected || payload.isInternetReachable === false;
      if (isOffline && !lastOffline) {
        console.log('[NET][INFO] Device offline');
        lastOffline = true;
      } else if (!isOffline && lastOffline) {
        console.log('[NET][INFO] Device back online');
        lastOffline = false;
      }
    };

    const unsubscribe = NetInfo.addEventListener(onChange);
    NetInfo.fetch().then(onChange);

    return () => {
      unsubscribe();
    };
  }, []);

  const contextValue = useMemo(() => status, [status]);

  return (
    <NetworkStatusContext.Provider value={contextValue}>
      {children}
    </NetworkStatusContext.Provider>
  );
};
