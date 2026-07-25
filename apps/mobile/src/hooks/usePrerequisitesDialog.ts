import {useCallback, useEffect, useState} from 'react';

import {navigateToProfile} from '@/navigation/navigationRef';

export function usePrerequisitesDialog(refreshReadiness: () => Promise<void>) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }

    refreshReadiness().catch(() => {});
  }, [visible, refreshReadiness]);

  const openDialog = useCallback(() => {
    setVisible(true);
  }, []);

  const closeDialog = useCallback(() => {
    setVisible(false);
  }, []);

  const onGoToProfilePress = useCallback(() => {
    setVisible(false);
    navigateToProfile();
  }, []);

  return {
    visible,
    openDialog,
    closeDialog,
    onGoToProfilePress,
  };
}
