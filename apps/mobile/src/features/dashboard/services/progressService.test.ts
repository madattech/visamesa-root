import {
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
          {key: 'passport', label: 'Passport', type: 'self_declared'},
          {key: 'appointment-confirmation', label: 'Appointment confirmation', type: 'automation'},
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
});
