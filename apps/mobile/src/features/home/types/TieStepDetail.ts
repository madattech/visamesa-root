export type OfficialLink = {
  label: string;
  url: string;
};

export type RequirementType = 'automation' | 'form' | 'self_declared';

export type AutomationId = 'empadronamiento' | 'cita-previa';

export type Requirement = {
  label: string;
  description?: string;
  link?: OfficialLink;
  type: RequirementType;
  automationId?: AutomationId;
  formId?: string;
  /** When set, completion of this step shows a hint or auto-satisfies the requirement */
  referencesStepId?: number;
};

export type EstimatedTimeItem = {
  label: string;
  value: string;
};

export type EstimatedTime = EstimatedTimeItem[];

export type CommonQuestion = {
  question: string;
  answer: string;
};

export type StepCta = {
  start: string;
  complete: string;
};

export type TieStepDetail = {
  id: number;
  title: string;
  slug: string;
  short: string;
  description: string;
  estimatedTime: EstimatedTime;
  officialLinks: OfficialLink[];
  whyItExists: string;
  commonQuestions: CommonQuestion[];
  requirements: Requirement[];
  cta: StepCta;
  completionPrompt: string;
};
