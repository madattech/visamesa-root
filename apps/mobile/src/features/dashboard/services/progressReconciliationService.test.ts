import {reconcileStepStatuses} from '@/features/dashboard/services/progressReconciliationService';
import {getCompletedStepIds} from '@/features/dashboard/utils/progressUtils';
import {createTieStep} from '@/test/fixtures/tieSteps';
import {createUserProgress} from '@/test/fixtures/userProgress';

describe('progressReconciliationService', () => {
  it('downgrades completed status when requirements are incomplete', () => {
    const step = createTieStep({
      id: 1,
      requirements: [
        {key: 'passport', label: 'Passport', type: 'self_declared', location: 'in_app'},
        {key: 'certificate', label: 'Certificate', type: 'self_declared', location: 'in_app'},
      ],
    });
    const progress = createUserProgress({
      steps: [
        {
          stepId: 1,
          status: 'completed',
          requirements: {
            passport: {completed: true, source: {type: 'self_declared'}},
            certificate: {completed: false},
          },
        },
      ],
    });

    const reconciled = reconcileStepStatuses(progress, [step], {});

    expect(reconciled.steps[0]?.status).toBe('in_progress');
  });

  it('returns only stored completed step ids', () => {
    const progress = createUserProgress({
      steps: [
        {stepId: 1, status: 'completed', requirements: {}},
        {stepId: 2, status: 'in_progress', requirements: {}},
      ],
    });

    expect(getCompletedStepIds(progress)).toEqual([1]);
  });
});
