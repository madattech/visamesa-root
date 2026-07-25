import {
  type ProcessOverviewBadgeLabels,
  type ProcessOverviewContent,
  type ProcessOverviewPhaseContent,
  type ProcessOverviewStepContent,
  type ProcessOverviewTabKey,
  type ProcessOverviewVisamesaBadge,
} from './types';

const VALID_VISAMESA: ProcessOverviewVisamesaBadge[] = ['book', 'fill'];
const VALID_TABS: ProcessOverviewTabKey[] = ['profile', 'dashboard'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isVisamesaBadge(value: unknown): value is ProcessOverviewVisamesaBadge {
  return typeof value === 'string' && VALID_VISAMESA.includes(value as ProcessOverviewVisamesaBadge);
}

function isTabKey(value: unknown): value is ProcessOverviewTabKey {
  return typeof value === 'string' && VALID_TABS.includes(value as ProcessOverviewTabKey);
}

function parseStep(value: unknown, context: string): ProcessOverviewStepContent {
  if (!isRecord(value)) {
    throw new Error(`Invalid process overview step: ${context}`);
  }

  if (typeof value.title !== 'string' || typeof value.description !== 'string') {
    throw new Error(`Invalid process overview step copy: ${context}`);
  }

  if (value.visamesa !== undefined && !isVisamesaBadge(value.visamesa)) {
    throw new Error(`Invalid VisaMesa badge: ${context}`);
  }

  if (value.inPerson !== undefined && typeof value.inPerson !== 'boolean') {
    throw new Error(`Invalid in-person flag: ${context}`);
  }

  return {
    title: value.title,
    description: value.description,
    visamesa: value.visamesa,
    inPerson: value.inPerson,
  };
}

function parsePhase(value: unknown, index: number): ProcessOverviewPhaseContent {
  if (!isRecord(value)) {
    throw new Error(`Invalid process overview phase at index ${index}`);
  }

  if (typeof value.id !== 'string' || typeof value.title !== 'string') {
    throw new Error(`Invalid process overview phase metadata at index ${index}`);
  }

  if (value.tab !== undefined && !isTabKey(value.tab)) {
    throw new Error(`Invalid process overview tab key at index ${index}`);
  }

  if (!Array.isArray(value.steps) || value.steps.length === 0) {
    throw new Error(`Process overview phase must include steps: ${value.id}`);
  }

  return {
    id: value.id,
    title: value.title,
    tab: value.tab,
    steps: value.steps.map((step, stepIndex) =>
      parseStep(step, `${value.id}.steps[${stepIndex}]`),
    ),
  };
}

function parseBadgeLabels(value: unknown): ProcessOverviewBadgeLabels {
  if (!isRecord(value)) {
    throw new Error('Invalid process overview badge labels');
  }

  if (
    typeof value.inPerson !== 'string' ||
    typeof value.helpBook !== 'string' ||
    typeof value.helpFill !== 'string'
  ) {
    throw new Error('Invalid process overview badge label copy');
  }

  return {
    inPerson: value.inPerson,
    helpBook: value.helpBook,
    helpFill: value.helpFill,
  };
}

export function loadProcessOverview(raw: unknown): ProcessOverviewContent {
  if (!isRecord(raw)) {
    throw new Error('Invalid process overview content');
  }

  if (typeof raw.screenTitle !== 'string' || typeof raw.intro !== 'string') {
    throw new Error('Invalid process overview screen copy');
  }

  if (typeof raw.tabHint !== 'string') {
    throw new Error('Invalid process overview tab hint template');
  }

  if (!Array.isArray(raw.phases) || raw.phases.length === 0) {
    throw new Error('Process overview must include at least one phase');
  }

  return {
    screenTitle: raw.screenTitle,
    intro: raw.intro,
    tabHint: raw.tabHint,
    badges: parseBadgeLabels(raw.badges),
    phases: raw.phases.map(parsePhase),
  };
}
