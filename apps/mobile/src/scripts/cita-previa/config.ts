import type {Case, CitaPreviaDetails} from '../../types';

export interface CitaPreviaAutomationProfile {
  details: CitaPreviaDetails;
  provinceOptionIndex: number;
  tramitesOptionIndex: number;
}

export const citaPreviaPiiConfig: CitaPreviaAutomationProfile = {
  details: {
    nie: 'Y6950398L',
    Name: 'Girish Sardar',
    nationality: 88,
    documentType: 'nie',
  },
  provinceOptionIndex: 9,
  tramitesOptionIndex: 17,
};

export const buildCitaPreviaAutomationProfileFromCase = (
  caseData: Case,
  defaults: CitaPreviaAutomationProfile = citaPreviaPiiConfig,
): CitaPreviaAutomationProfile => ({
  details: {
    nie:
      caseData.profile.details?.nie ??
      caseData.profile.passportNumber ??
      defaults.details.nie,
    Name:
      caseData.profile.details?.Name ??
      caseData.profile.fullName ??
      defaults.details.Name,
    nationality:
      caseData.profile.details?.nationality ?? defaults.details.nationality,
    documentType:
      caseData.profile.details?.documentType ?? defaults.details.documentType,
  },
  provinceOptionIndex: defaults.provinceOptionIndex,
  tramitesOptionIndex: defaults.tramitesOptionIndex,
});
