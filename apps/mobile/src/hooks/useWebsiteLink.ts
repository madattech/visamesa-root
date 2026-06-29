import {Alert} from 'react-native';

import {getWebsiteUrl} from '@/config/website';
import {openWebsiteUrl} from '@/utils/openWebsiteUrl';

export function useWebsiteLink() {
  const openWebsitePath = async (path: string) => {
    const opened = await openWebsiteUrl(getWebsiteUrl(path));
    if (!opened) {
      Alert.alert('Error', 'Could not open the link');
    }
  };

  return {openWebsitePath};
}
