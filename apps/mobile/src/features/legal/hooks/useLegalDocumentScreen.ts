import {useCallback, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import type {LegalBlock, LegalDocumentId} from '@visamesa/content/legal';
import {
  getLegalDocumentI18nKey,
  getLegalNoticeBlocks,
  legalDocumentRequiresConsent,
} from '@visamesa/content/legal';

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

const CONSENT_TYPE_BY_DOCUMENT: Partial<Record<LegalDocumentId, ConsentType>> = {
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
  requiresConsent: boolean;
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

  const requiresConsent = legalDocumentRequiresConsent(documentId);
  const documentI18nKey = getLegalDocumentI18nKey(documentId);
  const consentType = CONSENT_TYPE_BY_DOCUMENT[documentId];
  const isAccepted =
    documentId === 'privacy'
      ? consentStatus.privacyPolicy
      : documentId === 'terms'
        ? consentStatus.termsOfService
        : false;
  const acceptedAt =
    documentId === 'privacy'
      ? consentStatus.privacyAcceptedAt
      : documentId === 'terms'
        ? consentStatus.termsAcceptedAt
        : null;

  const title = tLegal(`${documentI18nKey}.title`);
  const lastUpdated = tLegal(`${documentI18nKey}.lastUpdated`);
  const intro = tLegal(`${documentI18nKey}.intro`);

  const blocks = useMemo(() => {
    if (documentId === 'legal-notice') {
      return getLegalNoticeBlocks(tLegal);
    }

    const value = tLegal(`${documentI18nKey}.blocks`, {returnObjects: true});
    return Array.isArray(value) ? (value as LegalBlock[]) : [];
  }, [documentId, documentI18nKey, tLegal]);

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

  const acceptLabel = !requiresConsent
    ? ''
    : documentId === 'privacy'
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
    if (!requiresConsent || !consentType || isAccepting || isAccepted) {
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
    requiresConsent,
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
    requiresConsent,
    isAccepted,
    acceptedAt,
    isAccepting,
    acceptLabel,
    acceptedLabel,
    onAcceptPress,
    onPrivacyLinkPress,
  };
}
