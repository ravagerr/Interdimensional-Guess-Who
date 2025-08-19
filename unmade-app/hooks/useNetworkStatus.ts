import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import type { NetInfoState } from '@react-native-community/netinfo';

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
}

export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true, // start optimistic
    isInternetReachable: null,
    type: null,
  });

  useEffect(() => {
    NetInfo.fetch().then((state: NetInfoState) => {
      setNetworkStatus({
        isConnected: state.isConnected ?? false,
        // isConnected: false, // toggle this to test offline mode
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });
    });

    // listen for network state changes
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setNetworkStatus({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });
    });

    return unsubscribe;
  }, []);

  return networkStatus;
}

export function useIsOnline(): boolean {
  const { isConnected, isInternetReachable } = useNetworkStatus();
  
  // consider online if connected and either internet reachable is null (unknown) or true
  // this provides a more user-friendly experience by not blocking when we can't determine reachability
  return isConnected && (isInternetReachable !== false);
}
