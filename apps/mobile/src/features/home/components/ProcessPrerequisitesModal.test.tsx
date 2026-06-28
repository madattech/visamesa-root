import React from 'react';

import {ProcessPrerequisitesModal} from './ProcessPrerequisitesModal';
import {renderComponent} from '@/test/testRenderer';
import {
  PREREQUISITES_GET_SERVICE_BUTTON,
  PREREQUISITES_COMPLETE_PROFILE_BUTTON,
} from '@/features/home/data/prerequisitesContent';

describe('ProcessPrerequisitesModal', () => {
  const defaultProps = {
    visible: true,
    missing: ['payment', 'profile'] as ('payment' | 'profile')[],
    onClose: jest.fn(),
    onGetServicePress: jest.fn(),
    onCompleteProfilePress: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders both action buttons when both prerequisites are missing', () => {
    const tree = renderComponent(<ProcessPrerequisitesModal {...defaultProps} />);
    const json = tree.toJSON();

    expect(JSON.stringify(json)).toContain(PREREQUISITES_GET_SERVICE_BUTTON);
    expect(JSON.stringify(json)).toContain(PREREQUISITES_COMPLETE_PROFILE_BUTTON);
  });

  it('renders only profile button when only profile is missing', () => {
    const tree = renderComponent(
      <ProcessPrerequisitesModal {...defaultProps} missing={['profile']} />,
    );
    const json = tree.toJSON();
    const stringified = JSON.stringify(json);

    expect(stringified).not.toContain(PREREQUISITES_GET_SERVICE_BUTTON);
    expect(stringified).toContain(PREREQUISITES_COMPLETE_PROFILE_BUTTON);
  });

  it('renders only payment button when only payment is missing', () => {
    const tree = renderComponent(
      <ProcessPrerequisitesModal {...defaultProps} missing={['payment']} />,
    );
    const json = tree.toJSON();
    const stringified = JSON.stringify(json);

    expect(stringified).toContain(PREREQUISITES_GET_SERVICE_BUTTON);
    expect(stringified).not.toContain(PREREQUISITES_COMPLETE_PROFILE_BUTTON);
  });

  it('renders the bottom sheet when visible is true', () => {
    const tree = renderComponent(<ProcessPrerequisitesModal {...defaultProps} />);
    const json = tree.toJSON();

    expect(json).toBeTruthy();
  });

  it('uses StatusIndicator for prerequisite status', () => {
    const tree = renderComponent(<ProcessPrerequisitesModal {...defaultProps} />);
    const json = tree.toJSON();
    const stringified = JSON.stringify(json);

    // StatusIndicator should be used (either done or notDone status)
    expect(stringified).toMatch(/check-circle|error-outline/);
  });
});
