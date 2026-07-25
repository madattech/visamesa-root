import React from 'react';

import {ProcessOverviewPhase} from '@/features/home/components/ProcessOverviewPhase';
import {renderComponent} from '@/test/testRenderer';

const badgeLabels = {
  inPerson: 'Go in person',
  helpBook: 'VisaMesa helps you book',
  helpFill: 'VisaMesa helps you fill',
};

describe('ProcessOverviewPhase', () => {
  it('renders phase title, tab hint, steps, and VisaMesa badges', () => {
    const tree = renderComponent(
      <ProcessOverviewPhase
        badgeLabels={badgeLabels}
        phase={{
          id: 'tie-steps',
          title: 'The 6 TIE steps',
          tab: 'dashboard',
          tabHint: 'Complete these in the Dashboard tab.',
          steps: [
            {
              title: 'Register your address',
              description: 'Get empadronamiento at your local Ayuntamiento.',
              visamesa: 'book',
              inPerson: true,
            },
            {
              title: 'Fill your EX-17 form',
              description: 'Review your TIE application form before printing.',
              visamesa: 'fill',
            },
          ],
        }}
      />,
    );

    const output = JSON.stringify(tree.toJSON());
    expect(output).toContain('The 6 TIE steps');
    expect(output).toContain('Dashboard tab');
    expect(output).toContain('Register your address');
    expect(output).toContain('VisaMesa helps you book');
    expect(output).toContain('Go in person');
    expect(output).toContain('VisaMesa helps you fill');
  });

  it('shows a check icon for the done phase', () => {
    const tree = renderComponent(
      <ProcessOverviewPhase
        badgeLabels={badgeLabels}
        phase={{
          id: 'done',
          title: 'Done',
          steps: [
            {
              title: 'Your TIE is complete',
              description: 'Keep your card safe and note the expiry date.',
            },
          ],
        }}
      />,
    );

    const output = JSON.stringify(tree.toJSON());
    expect(output).toContain('check-circle');
    expect(output).not.toContain('"1"');
  });
});
