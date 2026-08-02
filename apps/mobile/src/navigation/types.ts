import {NavigatorScreenParams} from '@react-navigation/native';
import type {LegalDocumentId} from '@visamesa/content/legalBlocks';

import {ProfileSectionId} from '@/features/profile/data/profileSections';
import {CitaPreviaDetails} from '@/types';

export type HomeStackParamList = {
  Home: undefined;
  ProcessOverview: undefined;
};

export type DashboardStackParamList = {
  Dashboard: undefined;
  StepDetail: {
    stepId: number;
  };
};

export type ProfileStackParamList = {
  Profile: undefined;
  ProfileSection: {
    sectionId: ProfileSectionId;
  };
  Legal: undefined;
  LegalDocument: {
    documentId: LegalDocumentId;
  };
  Login: undefined;
  Settings: undefined;
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
};
