import {MainTabParamList} from '@/navigation/types';

export type TabIconName = 'home' | 'checklist' | 'person';

export type TabLabelKey = 'tabs.home' | 'tabs.dashboard' | 'tabs.profile';

export type TabConfigItem = {
  name: keyof MainTabParamList;
  labelKey: TabLabelKey;
  icon: TabIconName;
};

export const TAB_CONFIG: TabConfigItem[] = [
  {name: 'HomeTab', labelKey: 'tabs.home', icon: 'home'},
  {name: 'DashboardTab', labelKey: 'tabs.dashboard', icon: 'checklist'},
  {name: 'ProfileTab', labelKey: 'tabs.profile', icon: 'person'},
];
