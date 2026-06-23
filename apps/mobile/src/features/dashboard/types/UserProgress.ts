export type StepStatus = 'not_started' | 'in_progress' | 'completed';

export type AutomationAppointmentSummary = {
  office: string;
  date: string;
  time: string;
  location?: string;
  confirmationCode?: string;
  isPlaceholder?: boolean;
};

export type RequirementCompletionSource =
  | {type: 'self_declared'}
  | {
      type: 'automation';
      automationId: string;
      completedAt: string;
      appointment?: AutomationAppointmentSummary;
    }
  | {type: 'form'; formId: string; confirmedAt: string}
  | {type: 'referenced_step'; stepId: number};

export type RequirementProgress = {
  completed: boolean;
  source?: RequirementCompletionSource;
};

export type UserStepProgress = {
  stepId: number;
  status: StepStatus;
  requirements: Record<string, RequirementProgress>;
  startedAt?: string;
  completedAt?: string;
};

export type UserProgress = {
  currentStepId: number;
  steps: UserStepProgress[];
};
