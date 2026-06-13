import {UserProgress} from '@/features/dashboard/types/UserProgress';

export function createUserProgress(
  overrides: Partial<UserProgress> = {},
): UserProgress {
  return {
    currentStepId: 1,
    steps: [
      {
        stepId: 1,
        status: 'not_started',
        requirements: {
          'Valid passport and NIE': {completed: false},
          'A rental contract or proof of residence': {completed: false},
          'Appointment confirmation': {completed: false},
        },
      },
      {
        stepId: 2,
        status: 'not_started',
        requirements: {},
      },
    ],
    ...overrides,
  };
}
