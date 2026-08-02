import {useCallback, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import type {LegalBlock, LegalDocumentId} from '@visamesa/content/legalBlocks';

import {useAppDialog} from '@/contexts/AppDialogContext';
import {useConsent} from '@/contexts/ConsentContext';
import {
  ConsentType,
  consentService,
} from '@/features/profile/services/consentService';
import {ProfileStackParamList} from '@/navigation/types';

type LegalDocumentNavigation = NativeStackNavigationProp<
  ProfileStackParamList,
  'LegalDocument'
>;

const CONSENT_TYPE_BY_DOCUMENT: Record<LegalDocumentId, ConsentType> = {
  privacy: 'privacy_policy',
  terms: 'terms_of_service',
};

export type UseLegalDocumentScreenResult = {
  title: string;
  lastUpdated: string;
  intro: string;
  disclaimerTitle: string | null;
  disclaimerParagraphs: string[];
  blocks: LegalBlock[];
  isAccepted: boolean;
  acceptedAt: string | null;
  isAccepting: boolean;
  acceptLabel: string;
  acceptedLabel: string;
  onAcceptPress: () => Promise<void>;
  onPrivacyLinkPress: () => void;
};

export function useLegalDocumentScreen(
  documentId: LegalDocumentId,
): UseLegalDocumentScreenResult {
  const navigation = useNavigation<LegalDocumentNavigation>();
  const {showAlert} = useAppDialog();
  const {refreshConsent, consentStatus} = useConsent();
  const {t} = useTranslation('profile');
  const {t: tLegal} = useTranslation('legal');
  const {t: tCommon} = useTranslation('common');
  const [isAccepting, setIsAccepting] = useState(false);

  const consentType = CONSENT_TYPE_BY_DOCUMENT[documentId];
  const isAccepted =
    documentId === 'privacy'
      ? consentStatus.privacyPolicy
      : consentStatus.termsOfService;
  const acceptedAt =
    documentId === 'privacy'
      ? consentStatus.privacyAcceptedAt
      : consentStatus.termsAcceptedAt;

  const title = tLegal(`${documentId}.title`);
  const lastUpdated = tLegal(`${documentId}.lastUpdated`);
  const intro = tLegal(`${documentId}.intro`);

  const blocks = useMemo(() => {
    const value = tLegal(`${documentId}.blocks`, {returnObjects: true});
    return Array.isArray(value) ? (value as LegalBlock[]) : [];
  }, [documentId, tLegal]);

  const disclaimerTitle =
    documentId === 'terms' ? tLegal('disclaimer.sectionTitle') : null;

  const disclaimerParagraphs = useMemo(() => {
    if (documentId !== 'terms') {
      return [];
    }

    const paragraphs = tLegal('disclaimer.masterParagraphs', {
      returnObjects: true,
    });

    return Array.isArray(paragraphs) ? paragraphs : [];
  }, [documentId, tLegal]);

  const acceptLabel =
    documentId === 'privacy'
      ? t('legalDocument.acceptPrivacy')
      : t('legalDocument.acceptTerms');

  const acceptedLabel = useMemo(() => {
    if (!acceptedAt) {
      return t('legalDocument.accepted');
    }

    const formatted = new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
    }).format(new Date(acceptedAt));

    return t('legalDocument.acceptedOn', {date: formatted});
  }, [acceptedAt, t]);

  const onAcceptPress = useCallback(async () => {
    if (isAccepting || isAccepted) {
      return;
    }

    setIsAccepting(true);

    try {
      await consentService.recordConsentType(consentType);
      await refreshConsent();
    } catch {
      showAlert(tCommon('errors.title'), t('legalDocument.acceptFailed'));
    } finally {
      setIsAccepting(false);
    }
  }, [
    consentType,
    isAccepting,
    isAccepted,
    refreshConsent,
    showAlert,
    t,
    tCommon,
  ]);

  const onPrivacyLinkPress = useCallback(() => {
    navigation.push('LegalDocument', {documentId: 'privacy'});
  }, [navigation]);

  return {
    title,
    lastUpdated,
    intro,
    disclaimerTitle,
    disclaimerParagraphs,
    blocks,
    isAccepted,
    acceptedAt,
    isAccepting,
    acceptLabel,
    acceptedLabel,
    onAcceptPress,
    onPrivacyLinkPress,
  };
}
