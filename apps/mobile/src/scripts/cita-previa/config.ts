import type {CitaPreviaDetails} from '../../types';

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
