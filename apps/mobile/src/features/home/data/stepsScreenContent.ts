export const STEPS_SCREEN_TITLE = 'TIE Steps';

export const STEPS_SCREEN_DESCRIPTION =
  'Detailed guides for each stage of your Barcelona TIE process will appear here.';

export const STEPS_DEV_ACTIONS = [
  {id: 'citaPrevia', label: 'Cita Previa'},
  {id: 'empadronamiento', label: 'Empadronamiento'},
] as const;

export type StepsDevActionId = (typeof STEPS_DEV_ACTIONS)[number]['id'];
