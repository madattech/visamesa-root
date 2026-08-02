import {useEffect} from 'react';
import {AppState} from 'react-native';

import {useAuth} from '@/contexts/AuthContext';
import {syncStoredProgressToBackend} from '@/features/dashboard/services/progressSyncService';

export function ProgressSyncListener() {
  const {user} = useAuth();

  useEffect(() => {
    if (!user) {
      return;
    }

    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        syncStoredProgressToBackend().catch(() => {});
      }
    });

    return () => subscription.remove();
  }, [user]);

  return null;
}
