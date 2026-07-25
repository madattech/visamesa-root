import {describe, expect, it} from 'vitest';

import {initSharedI18n, i18n} from '../i18n/init';
import {buildProcessOverview} from './buildProcessOverview';
import {loadProcessOverview} from './loadProcessOverview';
import {PROCESS_OVERVIEW_DONE_PHASE_ID} from './types';

describe('loadProcessOverview', () => {
  it('parses valid content', () => {
    const content = loadProcessOverview({
      screenTitle: 'How VisaMesa works',
      intro: 'Intro copy',
      tabHint: 'Complete these in the {{tab}} tab.',
      badges: {
        inPerson: 'Go in person',
        helpBook: 'VisaMesa helps you book',
        helpFill: 'VisaMesa helps you fill',
      },
      phases: [
        {
          id: 'before-start',
          title: 'Before you start',
          tab: 'profile',
          steps: [{title: 'Create your account', description: 'Sign up.'}],
        },
      ],
    });

    expect(content.phases[0]?.tab).toBe('profile');
    expect(content.badges.helpBook).toBe('VisaMesa helps you book');
  });

  it('rejects invalid badge values', () => {
    expect(() =>
      loadProcessOverview({
        screenTitle: 'Title',
        intro: 'Intro',
        tabHint: 'Hint',
        badges: {inPerson: 'x', helpBook: 'y', helpFill: 'z'},
        phases: [
          {
            id: 'tie-steps',
            title: 'Steps',
            steps: [
              {
                title: 'Step',
                description: 'Desc',
                visamesa: 'invalid',
              },
            ],
          },
        ],
      }),
    ).toThrow('Invalid VisaMesa badge');
  });

  it('rejects empty phases', () => {
    expect(() =>
      loadProcessOverview({
        screenTitle: 'Title',
        intro: 'Intro',
        tabHint: 'Hint',
        badges: {inPerson: 'x', helpBook: 'y', helpFill: 'z'},
        phases: [],
      }),
    ).toThrow('at least one phase');
  });
});

describe('buildProcessOverview', () => {
  it('builds localized content for each supported language', async () => {
    for (const language of ['en', 'es', 'zh'] as const) {
      await initSharedI18n({language});

      const content = buildProcessOverview((key, options) =>
        i18n.t(key, {...(options ?? {}), ns: 'processOverview'}),
      );

      expect(content.screenTitle.length).toBeGreaterThan(0);
      expect(content.phases.length).toBe(3);
      expect(content.phases.some(phase => phase.tab === 'profile')).toBe(true);
      expect(content.phases.some(phase => phase.tab === 'dashboard')).toBe(true);
      expect(
        content.phases.find(phase => phase.id === PROCESS_OVERVIEW_DONE_PHASE_ID)
          ?.steps,
      ).toHaveLength(1);
    }
  });
});
