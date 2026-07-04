import React from 'react';

import {PaymentAlreadyPaidDialog} from './PaymentAlreadyPaidDialog';
import {renderComponent} from '@/test/testRenderer';

describe('PaymentAlreadyPaidDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnSeeStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and message', () => {
    const tree = renderComponent(
      <PaymentAlreadyPaidDialog
        visible={true}
        onClose={mockOnClose}
        onSeeStatus={mockOnSeeStatus}
      />,
    );

    const stringified = JSON.stringify(tree.toJSON());

    expect(stringified).toContain('Already paid');
    expect(stringified).toContain('active VisaMesa service');
  });

  it('renders OK and See status buttons', () => {
    const tree = renderComponent(
      <PaymentAlreadyPaidDialog
        visible={true}
        onClose={mockOnClose}
        onSeeStatus={mockOnSeeStatus}
      />,
    );

    const stringified = JSON.stringify(tree.toJSON());

    expect(stringified).toContain('OK');
    expect(stringified).toContain('See status');
  });
});
