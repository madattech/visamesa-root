import {useState, useMemo, useCallback} from 'react';
import {Linking} from 'react-native';
import {useTranslation} from 'react-i18next';
import {parseTieStepFaqs} from '@visamesa/content/tieSteps/detail';
import {SUPPORT_EMAIL} from '@visamesa/content/site';

import {useAuth} from '@/contexts/AuthContext';
import {useToast} from '@/components/Toast/ToastProvider';
import {useAppDialog} from '@/contexts/AppDialogContext';
import {useTieSteps} from '@/features/home/hooks/useTieSteps';
import {useUserProgress} from '@/features/dashboard/hooks/useUserProgress';
import type {CommonQuestion} from '@/features/home/types/TieStepDetail';
import {
  buildGuestSupportContextFromEmail,
  buildSupportContext,
  formatContextForDisplay,
  isValidSupportEmail,
} from '@/features/support/services/supportContextService';
import {
  submitPublicSupportTicket,
  submitSupportTicket,
} from '@/features/support/services/supportApi';
import {resolveSupportFaqs} from '@/features/support/services/supportFaqsService';
import type {SupportContext} from '@/features/support/types/SupportContext';

export type UseSupportScreenResult = {
  isLoading: boolean;
  isAuthenticated: boolean;
  supportContext: SupportContext | null;
  contextDisplayItems: Array<{label: string; value: string}>;
  faqs: CommonQuestion[];
  email: string;
  message: string;
  isSending: boolean;
  canSend: boolean;
  onEmailChange: (text: string) => void;
  onMessageChange: (text: string) => void;
  onSendMessage: () => Promise<void>;
  onWhatsAppPress: () => void;
};

export function useSupportScreen(): UseSupportScreenResult {
  const {t} = useTranslation(['support', 'tieSteps']);
  const {user, isAuthenticated} = useAuth();
  const {showToast} = useToast();
  const {showAlert} = useAppDialog();
  const {steps, isLoading: isStepsLoading} = useTieSteps();
  const {progress, isLoading: isProgressLoading} = useUserProgress();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const isLoading = isAuthenticated && (isStepsLoading || isProgressLoading);

  const supportContext = useMemo<SupportContext | null>(() => {
    if (isAuthenticated && user?.email) {
      return buildSupportContext(user.id, user.email, progress, steps);
    }

    if (!isAuthenticated && isValidSupportEmail(email)) {
      return buildGuestSupportContextFromEmail(email);
    }

    if (!isAuthenticated) {
      return buildGuestSupportContextFromEmail('');
    }

    return null;
  }, [email, isAuthenticated, progress, steps, user]);

  const contextDisplayItems = useMemo(() => {
    if (!supportContext) {
      return [];
    }

    return formatContextForDisplay(supportContext, t);
  }, [supportContext, t]);

  const genericFaqs = useMemo<CommonQuestion[]>(
    () => parseTieStepFaqs(t('tieSteps:faqs', {returnObjects: true})),
    [t],
  );

  const faqs = useMemo<CommonQuestion[]>(
    () =>
      resolveSupportFaqs(genericFaqs, {
        isAuthenticated,
        progress,
        steps,
      }),
    [genericFaqs, isAuthenticated, progress, steps],
  );

  const responseEmail = isAuthenticated
    ? user?.email ?? ''
    : email.trim().toLowerCase();

  const canSend = Boolean(
    message.trim().length >= 10 &&
      !isSending &&
      (isAuthenticated
        ? supportContext?.email
        : isValidSupportEmail(email)),
  );

  const onEmailChange = useCallback((text: string) => {
    setEmail(text);
  }, []);

  const onMessageChange = useCallback((text: string) => {
    setMessage(text);
  }, []);

  const onSendMessage = useCallback(async () => {
    if (!canSend || !supportContext) {
      return;
    }

    setIsSending(true);

    try {
      if (isAuthenticated && user?.email) {
        await submitSupportTicket({
          message: message.trim(),
          context: {
            ...supportContext,
            userId: user.id,
            email: user.email,
            appVersion: supportContext.appVersion ?? '1.0.0',
            osVersion: supportContext.osVersion ?? '',
          },
        });
      } else {
        await submitPublicSupportTicket({
          email: email.trim().toLowerCase(),
          message: message.trim(),
          context: supportContext,
        });
      }

      setMessage('');
      if (!isAuthenticated) {
        setEmail('');
      }

      showAlert(
        t('support:messageSent'),
        t('support:messageSentDescription', {email: responseEmail}),
      );
    } catch {
      showAlert(
        t('support:messageFailedTitle'),
        t('support:messageFailedDescription', {email: SUPPORT_EMAIL}),
      );
    } finally {
      setIsSending(false);
    }
  }, [
    canSend,
    email,
    isAuthenticated,
    message,
    responseEmail,
    showAlert,
    supportContext,
    t,
    user,
  ]);

  const onWhatsAppPress = useCallback(() => {
    const whatsappMessage = t('support:whatsappMessage', {
      stepTitle:
        supportContext?.currentStepTitle ?? t('support:noStepContext'),
      completedCount: supportContext?.completedStepCount ?? 0,
      totalSteps: supportContext?.totalSteps ?? 6,
    });

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

    Linking.openURL(whatsappUrl).catch(() => {
      showToast(t('common:errors.openLink'));
    });
  }, [supportContext, t, showToast]);

  return {
    isLoading,
    isAuthenticated,
    supportContext,
    contextDisplayItems,
    faqs,
    email,
    message,
    isSending,
    canSend,
    onEmailChange,
    onMessageChange,
    onSendMessage,
    onWhatsAppPress,
  };
}
