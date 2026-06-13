import React from 'react';
import MaterialIcons from '@react-native-vector-icons/material-icons';

export const DASHBOARD_EMPTY_ICON: React.ComponentProps<
  typeof MaterialIcons
>['name'] = 'dashboard';

export const DASHBOARD_EMPTY_TITLE = 'Your progress at a glance';

export const DASHBOARD_EMPTY_SUBTITLE =
  'Sign in to track your TIE steps, prepare documents, and see what to do next.';

export const DASHBOARD_HEADER_TITLE = 'Dashboard';

export const DASHBOARD_STEP_DETAIL_LABEL = 'Learn more';

export const DASHBOARD_COMPLETE_PREVIOUS_STEP_HINT =
  'Complete the previous step before marking this one done.';

export const DASHBOARD_REQUIREMENTS_TITLE = 'What you need';

export const DASHBOARD_INCOMPLETE_STEP_MESSAGE =
  'Complete all checklist items before marking this step done.';

export const DASHBOARD_AUTOMATION_SUCCESS = 'Appointment booked successfully';

export const DASHBOARD_FORM_COMING_SOON = 'Form review coming soon';

export const getStepOfTotalLabel = (stepId: number, total: number) =>
  `Step ${stepId} of ${total}`;

export const getCompletedInStepHint = (stepId: number) =>
  `You completed this in Step ${stepId}`;
