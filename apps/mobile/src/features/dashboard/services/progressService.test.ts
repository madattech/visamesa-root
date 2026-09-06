import {
  buildInitialProgressFromSteps,
  clearProgressMemoryCache,
  fetchUserProgress,
  resetUserProgress,
  subscribeToProgressReset,
  updateRequirementProgress,
  updateStepStatus,
} from '@/features/dashboard/services/progressService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('@/features/home/services/tieStepsService', () => ({
  fetchTieSteps: jest.fn(),
}));

const {fetchTieSteps} = jest.requireMock(
  '@/features/home/services/tieStepsService',
) as {fetchTieSteps: jest.Mock};

describe('progressService', () => {
  beforeEach(async () => {
    await resetUserProgress();
    fetchTieSteps.mockResolvedValue([
      {
        id: 1,
        requirements: [
          {key: 'passport', label: 'Passport', type: 'self_declared', location: 'in_app'},
          {
            key: 'appointment-confirmation',
            label: 'Appointment confirmation',
            type: 'assisted_booking',
            location: 'in_app',
          },
        ],
      },
    ]);
  });

  it('creates initial progress for all steps', async () => {
    const progress = await fetchUserProgress();

    expect(progress.currentStepId).toBe(1);
    expect(progress.steps).toHaveLength(1);
    expect(progress.steps[0]?.requirements.passport?.completed).toBe(false);
  });

  it('builds fresh progress from step definitions', () => {
    const progress = buildInitialProgressFromSteps([
      {
        id: 1,
        requirements: [
          {key: 'passport', label: 'Passport', type: 'self_declared', location: 'in_app'},
        ],
      },
      {
        id: 2,
        requirements: [],
      },
    ]);

    expect(progress.currentStepId).toBe(1);
    expect(progress.steps).toHaveLength(2);
    expect(progress.steps[0]?.status).toBe('not_started');
    expect(progress.steps[0]?.requirements.passport?.completed).toBe(false);
  });

  it('updates step and requirement progress', async () => {
    let progress = await fetchUserProgress();

    progress = await updateStepStatus(progress, 1, 'in_progress');
    progress = await updateRequirementProgress(progress, 1, 'passport', {
      completed: true,
      source: {type: 'self_declared'},
    });

    expect(progress.steps[0]?.status).toBe('in_progress');
    expect(progress.steps[0]?.requirements.passport?.completed).toBe(true);
  });

  it('notifies dev subscribers when progress is reset', async () => {
    const listener = jest.fn();

    subscribeToProgressReset(listener);
    await resetUserProgress();

    expect(listener).toHaveBeenCalled();
  });

  it('clears in-memory progress without deleting stored progress', async () => {
    const progress = await fetchUserProgress();

    clearProgressMemoryCache();
    const reloaded = await fetchUserProgress();

    expect(reloaded.currentStepId).toBe(progress.currentStepId);
  });
});
