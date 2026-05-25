import {MainTabParamList} from '@/navigation/types';

export type TabIconName = 'home' | 'checklist' | 'person';

export type TabConfigItem = {
  name: keyof MainTabParamList;
  label: string;
  icon: TabIconName;
};

export const TAB_CONFIG: TabConfigItem[] = [
  {name: 'HomeTab', label: 'Home', icon: 'home'},
  {name: 'DashboardTab', label: 'Dashboard', icon: 'checklist'},
  {name: 'ProfileTab', label: 'Profile', icon: 'person'},
];
