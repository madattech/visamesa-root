import {NavigatorScreenParams} from '@react-navigation/native';

import {Case, CitaPreviaDetails} from '@/types';

export type HomeStackParamList = {
  Home: undefined;
  Steps: undefined;
};

export type DashboardStackParamList = {
  Dashboard: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  DashboardTab: NavigatorScreenParams<DashboardStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type WebViewAutomationKind = 'cita-previa' | 'empadronamiento';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  WebsiteWebView: {
    automation?: WebViewAutomationKind;
    url?: string;
    title?: string;
    details?: CitaPreviaDetails;
  };
  // Legacy automation routes — not mounted yet
  Login: undefined;
  CaseList: undefined;
  Automation: {case: Case};
};
