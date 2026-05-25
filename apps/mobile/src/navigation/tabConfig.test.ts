import {TAB_CONFIG} from '@/navigation/tabConfig';

describe('TAB_CONFIG', () => {
  it('defines home, dashboard, and profile tabs with unique routes', () => {
    const routeNames = TAB_CONFIG.map(tab => tab.name);

    expect(routeNames).toEqual(['HomeTab', 'DashboardTab', 'ProfileTab']);
    expect(new Set(routeNames).size).toBe(3);
    expect(TAB_CONFIG.map(tab => tab.label)).toEqual([
      'Home',
      'Dashboard',
      'Profile',
    ]);
  });
});
