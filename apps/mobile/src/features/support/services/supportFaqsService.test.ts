import {resolveSupportFaqs} from './supportFaqsService';
import type {UserProgress} from '@/features/dashboard/types/UserProgress';
import type {TieStepDetail} from '@/features/home/types/TieStepDetail';

const mockSteps: TieStepDetail[] = [
  {
    id: 1,
    slug: 'empadronamiento',
    title: 'Register Your Address',
    short: 'Get empadronamiento',
    description: 'Test description',
    whyItExists: 'Test',
    completionPrompt: 'Did you complete?',
    cta: {start: 'Start', complete: 'Complete'},
    estimatedTime: [],
    officialLinks: [],
    commonQuestions: [
      {question: 'Step-specific question?', answer: 'Step-specific answer.'},
    ],
    requirements: [],
  },
];

const mockProgress: UserProgress = {
  currentStepId: 1,
  steps: [
    {
      stepId: 1,
      status: 'in_progress',
      requirements: {},
    },
  ],
};

const genericFaqs = [
  {question: 'Generic question?', answer: 'Generic answer.'},
];

describe('supportFaqsService', () => {
  describe('resolveSupportFaqs', () => {
    it('returns generic FAQs for logged-out users', () => {
      const faqs = resolveSupportFaqs(genericFaqs, {
        isAuthenticated: false,
        progress: null,
        steps: mockSteps,
      });

      expect(faqs).toEqual(genericFaqs);
    });

    it('returns step-specific FAQs for logged-in users when available', () => {
      const faqs = resolveSupportFaqs(genericFaqs, {
        isAuthenticated: true,
        progress: mockProgress,
        steps: mockSteps,
      });

      expect(faqs).toEqual(mockSteps[0].commonQuestions);
    });

    it('falls back to generic FAQs when the current step has none', () => {
      const faqs = resolveSupportFaqs(genericFaqs, {
        isAuthenticated: true,
        progress: mockProgress,
        steps: [{...mockSteps[0], commonQuestions: []}],
      });

      expect(faqs).toEqual(genericFaqs);
    });
  });
});
