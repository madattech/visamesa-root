import {API_ENDPOINTS} from '@/config/api';
import apiClient from '@/services/api';
import {reportClientErrorFromException} from '@/services/clientErrorService';
import {UserProgress} from '@/features/dashboard/types/UserProgress';

export async function syncProgressSnapshot(
  progress: UserProgress,
): Promise<void> {
  try {
    await apiClient.put(API_ENDPOINTS.userProgress, {
      currentStepId: progress.currentStepId,
      steps: progress.steps,
      clientUpdatedAt: new Date().toISOString(),
    });
  } catch (error) {
    reportClientErrorFromException('PROGRESS_SYNC_FAILED', error, {
      currentStepId: progress.currentStepId,
    });
    throw error;
  }
}

export async function syncStoredProgressToBackend(): Promise<void> {
  const {fetchUserProgress} = await import(
    '@/features/dashboard/services/progressService'
  );
  const progress = await fetchUserProgress();

  try {
    await syncProgressSnapshot(progress);
  } catch {
    // Best-effort foreground sync
  }
}
