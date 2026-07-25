export type ProcessOverviewVisamesaBadge = 'book' | 'fill';

export type ProcessOverviewTabKey = 'profile' | 'dashboard';

export const PROCESS_OVERVIEW_DONE_PHASE_ID = 'done';

export type ProcessOverviewStepContent = {
  title: string;
  description: string;
  visamesa?: ProcessOverviewVisamesaBadge;
  inPerson?: boolean;
};

export type ProcessOverviewPhaseContent = {
  id: string;
  title: string;
  tab?: ProcessOverviewTabKey;
  steps: ProcessOverviewStepContent[];
};

export type ProcessOverviewBadgeLabels = {
  inPerson: string;
  helpBook: string;
  helpFill: string;
};

export type ProcessOverviewContent = {
  screenTitle: string;
  intro: string;
  tabHint: string;
  badges: ProcessOverviewBadgeLabels;
  phases: ProcessOverviewPhaseContent[];
};

export type ProcessOverviewTranslateFn = (
  key: string,
  options?: {returnObjects?: boolean},
) => string | unknown;
