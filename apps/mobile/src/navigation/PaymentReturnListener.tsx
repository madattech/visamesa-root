import {useEffect} from 'react';
import {Linking} from 'react-native';
import {useTranslation} from 'react-i18next';

import {useToast} from '@/components/Toast/ToastProvider';
import {useAuth} from '@/contexts/AuthContext';
import {useEntitlements} from '@/contexts/EntitlementsContext';
import {useProfileCompletion} from '@/hooks/useProfileCompletion';
import {
  navigateToDashboard,
  navigateToLogin,
  navigateToProfile,
} from '@/navigation/navigationRef';
import {reportClientErrorFromException} from '@/services/clientErrorService';
import {paymentService} from '@/services/paymentService';

function isCheckoutSuccessUrl(url: string): boolean {
  const normalized = url.toLowerCase();

  return (
    normalized.startsWith('visamesa://checkout/success') ||
    normalized.startsWith('visamesa:///checkout/success')
  );
}

export function extractCheckoutSessionId(url: string): string | null {
  const queryIndex = url.indexOf('?');

  if (queryIndex === -1) {
    return null;
  }

  const params = new URLSearchParams(url.slice(queryIndex + 1));
  return params.get('session_id');
}

export function PaymentReturnListener() {
  const { isAuthenticated } = useAuth();
  const { waitForPaidService, refreshEntitlements } = useEntitlements();
  const { refreshCompletion } = useProfileCompletion();
  const { showToast } = useToast();
  const { t } = useTranslation('checkout');

  useEffect(() => {
    async function handlePaymentReturn(url: string | null) {
      if (!url || !isCheckoutSuccessUrl(url)) {
        return;
      }

      if (!isAuthenticated) {
        showToast(t('paymentReturn.signInRequired'));
        navigateToLogin();
        return;
      }

      const sessionId = extractCheckoutSessionId(url);

      if (sessionId) {
        try {
          await paymentService.syncCheckoutSession(sessionId);
          await refreshEntitlements();
        } catch (error) {
          reportClientErrorFromException('PAYMENT_CHECKOUT_SYNC_FAILED', error, {
            hasSessionId: true,
          });
        }
      }

      const isReady = await waitForPaidService();

      if (!isReady) {
        reportClientErrorFromException(
          'PAYMENT_RETURN_ENTITLEMENTS_TIMEOUT',
          new Error('Entitlements not granted after payment return'),
          {hasSessionId: Boolean(sessionId)},
        );
        showToast(t('paymentReturn.syncing'));
        navigateToDashboard();
        return;
      }

      const freshIsComplete = await refreshCompletion();

      if (freshIsComplete) {
        showToast(t('paymentReturn.serviceReady'));
        navigateToDashboard();
      } else {
        showToast(t('paymentReturn.completeProfile'));
        navigateToProfile();
      }
    }

    Linking.getInitialURL().then(handlePaymentReturn).catch(() => {});

    const subscription = Linking.addEventListener('url', event => {
      handlePaymentReturn(event.url).catch(() => {});
    });

    return () => {
      subscription.remove();
    };
  }, [
    isAuthenticated,
    waitForPaidService,
    refreshEntitlements,
    refreshCompletion,
    showToast,
    t,
  ]);

  return null;
}
