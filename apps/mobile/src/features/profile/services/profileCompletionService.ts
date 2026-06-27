import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_COMPLETE_KEY = '@visamesa_profile_complete';

/**
 * Stores a boolean flag indicating whether the user's profile is complete.
 * This is a cached value to avoid decryption on every app launch.
 */
export const profileCompletionService = {
  async getIsComplete(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(PROFILE_COMPLETE_KEY);
      return value === 'true';
    } catch (error) {
      console.error('Failed to read profile completion status:', error);
      return false;
    }
  },

  async setIsComplete(isComplete: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(
        PROFILE_COMPLETE_KEY,
        isComplete ? 'true' : 'false',
      );
    } catch (error) {
      console.error('Failed to save profile completion status:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PROFILE_COMPLETE_KEY);
    } catch (error) {
      console.error('Failed to clear profile completion status:', error);
    }
  },
};
