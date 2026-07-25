import React from 'react';

import {PrerequisitesChecklist} from '@/features/dashboard/components/PrerequisitesChecklist';
import {PrerequisitesDialog} from '@/features/dashboard/components/PrerequisitesDialog';
import {renderComponent} from '@/test/testRenderer';

describe('PrerequisitesChecklist', () => {
  it('shows personal information, payment, and legal readiness items', () => {
    const tree = renderComponent(
      <PrerequisitesChecklist
        missing={['personalInformation', 'payment', 'legalPrivacy']}
      />,
    );

    const output = JSON.stringify(tree.toJSON());
    expect(output).toContain('Complete your Personal Information');
    expect(output).toContain('Complete your Payment');
    expect(output).toContain('Read Legal & Privacy');
    expect(output).toContain('error-outline');
  });

  it('shows completed items with a success indicator', () => {
    const tree = renderComponent(
      <PrerequisitesChecklist missing={['payment']} />,
    );

    const output = JSON.stringify(tree.toJSON());
    expect(output).toContain('check-circle');
    expect(output).toContain('Complete your Personal Information');
    expect(output).toContain('error-outline');
    expect(output).toContain('Complete your Payment');
  });
});

describe('PrerequisitesDialog', () => {
  it('shows readiness checklist with dialog actions', () => {
    const tree = renderComponent(
      <PrerequisitesDialog
        visible
        missing={['personalInformation', 'payment', 'legalPrivacy']}
        onClose={() => {}}
        onGoToProfile={() => {}}
      />,
    );

    const output = JSON.stringify(tree.toJSON());
    expect(output).toContain('Before we can start');
    expect(output).toContain('Complete your profile to start the process');
    expect(output).toContain('Complete your Personal Information');
    expect(output).toContain('Complete your Payment');
    expect(output).toContain('Read Legal & Privacy');
    expect(output).toContain('error-outline');
    expect(output).not.toContain('radio-button-unchecked');
    expect(output).toContain('Not now');
    expect(output).toContain('Complete profile');
  });
});
