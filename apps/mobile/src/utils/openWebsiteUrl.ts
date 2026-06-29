import { Linking } from 'react-native';

/**
 * Opens a marketing-site URL in the system browser.
 * Skips Linking.canOpenURL — it often returns false for http://localhost on iOS
 * even when Safari can open the URL.
 */
export async function openWebsiteUrl(url: string): Promise<boolean> {
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}
