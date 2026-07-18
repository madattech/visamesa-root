import {TieStepDetail} from '@/features/home/types/TieStepDetail';

export function createTieStep(overrides: Partial<TieStepDetail> = {}): TieStepDetail {
  return {
    id: 1,
    slug: 'empadronamiento',
    title: 'Register Your Address',
    short: 'Register your address at the local Ayuntamiento.',
    description: 'Empadronamiento description',
    estimatedTime: [{label: 'Typical', value: '1-3 hours'}],
    officialLinks: [{label: 'Official link', url: 'https://example.com'}],
    whyItExists: 'Why it exists',
    commonQuestions: [{question: 'Question?', answer: 'Answer.'}],
    requirements: [
      {key: 'passport', label: 'Passport', type: 'self_declared', location: 'in_app'},
    ],
    cta: {
      start: "I'm starting this step",
      complete: 'I completed this step',
    },
    completionPrompt: 'Did you complete this step?',
    ...overrides,
  };
}

export function createTieSteps(count = 2): TieStepDetail[] {
  return Array.from({length: count}, (_, index) =>
    createTieStep({
      id: index + 1,
      title: `Step ${index + 1} Title Here`,
      slug: `step-${index + 1}` as TieStepDetail['slug'],
      short: `Short description for step ${index + 1}`,
    }),
  );
}
