export const STEPS_DEV_ACTIONS = [
  {id: 'citaPrevia', label: 'Cita Previa'},
  {id: 'empadronamiento', label: 'Empadronamiento'},
] as const;

export type StepsDevActionId = (typeof STEPS_DEV_ACTIONS)[number]['id'];
