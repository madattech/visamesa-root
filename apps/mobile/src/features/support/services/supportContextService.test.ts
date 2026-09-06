import {Platform} from 'react-native';

import {
  buildGuestSupportContextFromEmail,
  buildSupportContext,
  formatContextForDisplay,
  isValidSupportEmail,
} from './supportContextService';
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
    commonQuestions: [],
    requirements: [
      {
        key: 'passport-nie',
        label: 'Passport and NIE',
        type: 'self_declared',
        location: 'in_app',
      },
    ],
  },
  {
    id: 2,
    slug: 'required-documents',
    title: 'Fill EX-17 Form',
    short: 'Fill form',
    description: 'Test',
    whyItExists: 'Test',
    completionPrompt: 'Done?',
    cta: {start: 'Start', complete: 'Complete'},
    estimatedTime: [],
    officialLinks: [],
    commonQuestions: [],
    requirements: [],
  },
];

const mockProgress: UserProgress = {
  currentStepId: 1,
  steps: [
    {
      stepId: 1,
      status: 'in_progress',
      requirements: {
        'passport-nie': {completed: true},
      },
    },
    {
      stepId: 2,
      status: 'not_started',
      requirements: {},
    },
  ],
};

describe('supportContextService', () => {
  describe('buildSupportContext', () => {
    it('builds context with current step information', () => {
      const context = buildSupportContext(
        'user-123',
        'test@example.com',
        mockProgress,
        mockSteps,
      );

      expect(context.userId).toBe('user-123');
      expect(context.email).toBe('test@example.com');
      expect(context.currentStepId).toBe(1);
      expect(context.currentStepTitle).toBe('Register Your Address');
      expect(context.completedStepCount).toBe(0);
      expect(context.totalSteps).toBe(6);
      expect(context.language).toBe('en');
      expect(context.platform).toBe(Platform.OS);
    });

    it('includes requirement completion status', () => {
      const context = buildSupportContext(
        'user-123',
        'test@example.com',
        mockProgress,
        mockSteps,
      );

      expect(context.currentStepRequirements).toHaveLength(1);
      expect(context.currentStepRequirements[0]).toEqual({
        key: 'passport-nie',
        label: 'Passport and NIE',
        completed: true,
      });
    });

    it('handles null progress gracefully', () => {
      const context = buildSupportContext(
        'user-123',
        'test@example.com',
        null,
        mockSteps,
      );

      expect(context.currentStepId).toBeNull();
      expect(context.currentStepTitle).toBeNull();
      expect(context.completedSteps).toEqual([]);
      expect(context.currentStepRequirements).toEqual([]);
    });
  });

  describe('buildGuestSupportContextFromEmail', () => {
    it('builds guest context without step information', () => {
      const context = buildGuestSupportContextFromEmail('guest@example.com');

      expect(context.email).toBe('guest@example.com');
      expect(context.currentStepId).toBeNull();
      expect(context.completedStepCount).toBe(0);
      expect(context.currentStepRequirements).toEqual([]);
      expect(context.platform).toBe(Platform.OS);
    });
  });

  describe('isValidSupportEmail', () => {
    it('accepts valid email addresses', () => {
      expect(isValidSupportEmail('guest@example.com')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(isValidSupportEmail('not-an-email')).toBe(false);
      expect(isValidSupportEmail('')).toBe(false);
    });
  });

  describe('formatContextForDisplay', () => {
    it('formats context for display', () => {
      const context = buildSupportContext(
        'user-123',
        'test@example.com',
        mockProgress,
        mockSteps,
      );

      const mockT = (key: string) => key;
      const items = formatContextForDisplay(context, mockT);

      expect(items.length).toBeGreaterThan(0);
      expect(items.some(item => item.label === 'support:contextCurrentStep')).toBe(true);
    });

    it('falls back to default language when language is missing', () => {
      const context = buildSupportContext(
        'user-123',
        'test@example.com',
        mockProgress,
        mockSteps,
      );

      const mockT = (key: string) => key;
      const items = formatContextForDisplay(
        {...context, language: undefined as unknown as string},
        mockT,
      );

      expect(items.find(item => item.label === 'support:contextLanguage')?.value).toBe(
        'EN',
      );
    });
  });
});
