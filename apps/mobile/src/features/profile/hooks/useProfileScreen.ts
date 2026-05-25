export type UseProfileScreenResult = {
  title: string;
  message: string;
};

export function useProfileScreen(): UseProfileScreenResult {
  return {
    title: 'Profile',
    message: 'Manage your personal details and billing. Coming soon.',
  };
}
