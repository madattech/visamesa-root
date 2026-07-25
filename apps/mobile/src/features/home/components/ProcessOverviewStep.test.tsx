import React from 'react';

import {ProcessOverviewStep} from '@/features/home/components/ProcessOverviewStep';
import {renderComponent} from '@/test/testRenderer';

const badgeLabels = {
  inPerson: 'Go in person',
  helpBook: 'VisaMesa helps you book',
  helpFill: 'VisaMesa helps you fill',
};

describe('ProcessOverviewStep', () => {
  it('renders step number, copy, and badges', () => {
    const tree = renderComponent(
      <ProcessOverviewStep
        stepNumber={2}
        badgeLabels={badgeLabels}
        isLast={false}
        step={{
          title: 'Book fingerprint appointment',
          description: 'Secure a cita previa slot.',
          visamesa: 'book',
          inPerson: true,
        }}
      />,
    );

    const output = JSON.stringify(tree.toJSON());
    expect(output).toContain('Book fingerprint appointment');
    expect(output).toContain('VisaMesa helps you book');
    expect(output).toContain('Go in person');
    expect(output).toContain('"2"');
  });

  it('uses a check icon when showCompleteIcon is true', () => {
    const tree = renderComponent(
      <ProcessOverviewStep
        stepNumber={1}
        badgeLabels={badgeLabels}
        isLast
        showCompleteIcon
        step={{
          title: 'Your TIE is complete',
          description: 'Keep your card safe.',
        }}
      />,
    );

    const output = JSON.stringify(tree.toJSON());
    expect(output).toContain('check-circle');
    expect(output).not.toContain('"1"');
  });
});
