import {
  areAllRequirementsComplete,
  getCompletedStepIds,
  getEffectiveRequirementProgress,
  getNextIncompleteStepId,
  getStepStatus,
  isStepAccessible,
  isStepCompleted,
} from '@/features/dashboard/utils/progressUtils';
import {createTieStep} from '@/test/fixtures/tieSteps';
import {createUserProgress} from '@/test/fixtures/userProgress';

describe('progressUtils', () => {
  const step = createTieStep({
    id: 1,
    requirements: [
      {label: 'Passport', type: 'self_declared'},
      {
        label: 'Certificate',
        type: 'self_declared',
        referencesStepId: 2,
      },
    ],
  });

  it('returns not_started when step progress is missing', () => {
    const progress = createUserProgress({steps: []});

    expect(getStepStatus(progress, 1)).toBe('not_started');
  });

  it('marks referenced requirements complete when prior step is done', () => {
    const progress = createUserProgress({
      steps: [
        {
          stepId: 1,
          status: 'not_started',
          requirements: {Passport: {completed: false}},
        },
        {
          stepId: 2,
          status: 'completed',
          requirements: {},
        },
      ],
    });

    const effective = getEffectiveRequirementProgress(
      progress,
      step,
      'Certificate',
    );

    expect(effective.completed).toBe(true);
    expect(effective.source?.type).toBe('referenced_step');
  });

  it('checks whether all requirements are complete', () => {
    const progress = createUserProgress({
      steps: [
        {
          stepId: 1,
          status: 'in_progress',
          requirements: {
            Passport: {completed: true, source: {type: 'self_declared'}},
            Certificate: {completed: false},
          },
        },
        {
          stepId: 2,
          status: 'completed',
          requirements: {},
        },
      ],
    });

    expect(areAllRequirementsComplete(progress, step)).toBe(true);
  });

  it('finds the next incomplete step id', () => {
    const progress = createUserProgress({
      currentStepId: 1,
      steps: [
        {stepId: 1, status: 'completed', requirements: {}},
        {stepId: 2, status: 'not_started', requirements: {}},
      ],
    });
    const steps = [
      createTieStep({id: 1}),
      createTieStep({id: 2}),
      createTieStep({id: 3}),
    ];

    expect(getNextIncompleteStepId(progress, steps)).toBe(2);
    expect(isStepCompleted(progress, 1)).toBe(true);
    expect(getCompletedStepIds(progress)).toEqual([1]);
  });

  it('blocks navigation until previous steps are completed', () => {
    const progress = createUserProgress({
      steps: [
        {stepId: 1, status: 'not_started', requirements: {}},
        {stepId: 2, status: 'not_started', requirements: {}},
      ],
    });

    expect(isStepAccessible(progress, 1)).toBe(true);
    expect(isStepAccessible(progress, 2)).toBe(false);
  });
});
