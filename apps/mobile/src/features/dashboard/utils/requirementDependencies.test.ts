import {buildTieSteps} from '@visamesa/content/tieSteps/detail';
import {i18n} from '@visamesa/content/i18n';
import {TieStepDetail} from '@/features/home/types/TieStepDetail';

import {ProgressContext} from '@/features/dashboard/types/UserProgress';
import {
  canCheckRequirement,
  canShowDocumentActions,
  canUncheckRequirement,
  getRequirementToggleState,
} from '@/features/dashboard/utils/requirementDependencies';
import {createUserProgress} from '@/test/fixtures/userProgress';

const emptyContext: ProgressContext = {};

describe('requirementDependencies', () => {
  let steps: TieStepDetail[];
  let step1: TieStepDetail;
  let step3: TieStepDetail;
  let step5: TieStepDetail;

  beforeAll(() => {
    steps = buildTieSteps((key, options) => i18n.t(key, options));
    step1 = steps.find(step => step.id === 1)!;
    step3 = steps.find(step => step.id === 3)!;
    step5 = steps.find(step => step.id === 5)!;
  });
  it('blocks attend until passport, proof, and appointment are done', () => {
    const progress = createUserProgress({
      steps: [
        {
          stepId: 1,
          status: 'in_progress',
          requirements: {
            'passport-nie': {completed: true, source: {type: 'self_declared'}},
            'proof-of-residence': {completed: false},
            'appointment-confirmation': {completed: false},
            'attend-ayuntamiento': {completed: false},
          },
        },
      ],
    });

    expect(
      canCheckRequirement(progress, step1, 'attend-ayuntamiento', emptyContext),
    ).toBe(false);
  });

  it('allows attend when dependencies are complete', () => {
    const progress = createUserProgress({
      steps: [
        {
          stepId: 1,
          status: 'in_progress',
          requirements: {
            'passport-nie': {completed: true, source: {type: 'self_declared'}},
            'proof-of-residence': {completed: true, source: {type: 'self_declared'}},
            'appointment-confirmation': {
              completed: true,
              source: {type: 'automation', automationId: 'empadronamiento'},
            },
            'attend-ayuntamiento': {completed: false},
          },
        },
      ],
    });

    expect(
      canCheckRequirement(progress, step1, 'attend-ayuntamiento', emptyContext),
    ).toBe(true);
  });

  it('prevents unchecking passport when attend is checked', () => {
    const progress = createUserProgress({
      steps: [
        {
          stepId: 1,
          status: 'in_progress',
          requirements: {
            'passport-nie': {completed: true, source: {type: 'self_declared'}},
            'proof-of-residence': {completed: true, source: {type: 'self_declared'}},
            'appointment-confirmation': {
              completed: true,
              source: {type: 'automation', automationId: 'empadronamiento'},
            },
            'attend-ayuntamiento': {completed: true, source: {type: 'self_declared'}},
          },
        },
      ],
    });

    expect(
      canUncheckRequirement(progress, step1, 'passport-nie', emptyContext),
    ).toBe(false);
    expect(
      getRequirementToggleState(
        progress,
        step1,
        'passport-nie',
        emptyContext,
        steps,
      ).canUncheck,
    ).toBe(false);
  });

  it('allows unchecking attend without marking step completed', () => {
    const progress = createUserProgress({
      steps: [
        {
          stepId: 1,
          status: 'in_progress',
          requirements: {
            'passport-nie': {completed: true, source: {type: 'self_declared'}},
            'proof-of-residence': {completed: true, source: {type: 'self_declared'}},
            'appointment-confirmation': {
              completed: true,
              source: {type: 'automation', automationId: 'empadronamiento'},
            },
            'attend-ayuntamiento': {completed: true, source: {type: 'self_declared'}},
          },
        },
      ],
    });

    expect(
      getRequirementToggleState(
        progress,
        step1,
        'attend-ayuntamiento',
        emptyContext,
        steps,
      ).canUncheck,
    ).toBe(true);
  });

  it('shows document actions only after form confirmation', () => {
    const unconfirmed = createUserProgress({
      steps: [
        {
          stepId: 3,
          status: 'in_progress',
          requirements: {
            'ex-17-form': {completed: false},
          },
        },
      ],
    });
    const confirmed = createUserProgress({
      steps: [
        {
          stepId: 3,
          status: 'in_progress',
          requirements: {
            'ex-17-form': {
              completed: true,
              source: {type: 'form', formId: 'ex-17', confirmedAt: '2026-01-01'},
            },
          },
        },
      ],
    });
    const ex17 = step3.requirements.find(item => item.key === 'ex-17-form')!;

    expect(
      canShowDocumentActions(ex17, unconfirmed, steps, step3),
    ).toBe(false);
    expect(
      canShowDocumentActions(ex17, confirmed, steps, step3),
    ).toBe(true);
  });

  it('does not show document actions for stamped modelo 790 receipt', () => {
    const progress = createUserProgress({
      steps: [
        {
          stepId: 5,
          status: 'in_progress',
          requirements: {
            'modelo-790-receipt': {
              completed: true,
              source: {type: 'self_declared'},
            },
          },
        },
      ],
    });
    const receipt = step5.requirements.find(item => item.key === 'modelo-790-receipt')!;

    expect(
      canShowDocumentActions(receipt, progress, steps, step5),
    ).toBe(false);
  });

  it('does not allow checking form requirements via checkbox', () => {
    const progress = createUserProgress({
      steps: [
        {
          stepId: 3,
          status: 'in_progress',
          requirements: {
            'ex-17-form': {completed: false},
          },
        },
      ],
    });

    expect(
      getRequirementToggleState(
        progress,
        step3,
        'ex-17-form',
        emptyContext,
        steps,
      ).canCheck,
    ).toBe(false);
  });

  it('does not allow checking automation requirements via checkbox', () => {
    const progress = createUserProgress({
      steps: [
        {
          stepId: 2,
          status: 'in_progress',
          requirements: {
            'appointment-confirmation': {completed: false},
          },
        },
      ],
    });
    const step2 = steps.find(step => step.id === 2)!;

    expect(
      getRequirementToggleState(
        progress,
        step2,
        'appointment-confirmation',
        emptyContext,
        steps,
      ).canCheck,
    ).toBe(false);
  });

  it('allows unchecking confirmed form requirements', () => {
    const progress = createUserProgress({
      steps: [
        {
          stepId: 3,
          status: 'in_progress',
          requirements: {
            'ex-17-form': {
              completed: true,
              source: {type: 'form', formId: 'ex-17', confirmedAt: '2026-01-01'},
            },
          },
        },
      ],
    });

    expect(
      getRequirementToggleState(
        progress,
        step3,
        'ex-17-form',
        emptyContext,
        steps,
      ).canUncheck,
    ).toBe(true);
  });
});
