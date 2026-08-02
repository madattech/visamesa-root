export const DEV_UNLOCK_ENABLED = __DEV__ && process.env.NODE_ENV !== 'test';

export const DEV_UNLOCK_USER = {
  id: 'dev-user',
  email: 'dev@visamesa.local',
};
