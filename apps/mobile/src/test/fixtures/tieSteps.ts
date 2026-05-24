import {TieStepDetail} from '@/features/home/types/TieStepDetail';

export function createTieStep(overrides: Partial<TieStepDetail> = {}): TieStepDetail {
  return {
    id: 1,
    title: 'Register Your Address',
    slug: 'empadronamiento',
    short: 'Register your address at the local Ayuntamiento.',
    description: 'Empadronamiento description',
    estimatedTime: [{label: 'Typical', value: '1-3 hours'}],
    officialLinks: [{label: 'Official link', url: 'https://example.com'}],
    whyItExists: 'Why it exists',
    commonQuestions: [{question: 'Question?', answer: 'Answer.'}],
    requirements: [{label: 'Passport'}],
    ...overrides,
  };
}

export function createTieSteps(count = 2): TieStepDetail[] {
  return Array.from({length: count}, (_, index) =>
    createTieStep({
      id: index + 1,
      title: `Step ${index + 1} Title Here`,
      slug: `step-${index + 1}`,
      short: `Short description for step ${index + 1}`,
    }),
  );
}
