export type UseDashboardScreenResult = {
  title: string;
  message: string;
};

export function useDashboardScreen(): UseDashboardScreenResult {
  return {
    title: 'Dashboard',
    message:
      'Sign in to track your TIE progress through Barcelona. Coming soon.',
  };
}
