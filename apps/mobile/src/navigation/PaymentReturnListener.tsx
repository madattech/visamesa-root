import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useToast } from '@/components/Toast/ToastProvider';
import { useAuth } from '@/contexts/AuthContext';
import { useEntitlements } from '@/contexts/EntitlementsContext';
import {useProfileCompletion} from '@/hooks/useProfileCompletion';
import {
  navigateToDashboard,
  navigateToLogin,
  navigateToProfile,
} from '@/navigation/navigationRef';

function isCheckoutSuccessUrl(url: string): boolean {
  const normalized = url.toLowerCase();

  return (
    normalized.startsWith('visamesa://checkout/success') ||
    normalized.startsWith('visamesa:///checkout/success')
  );
}

export function PaymentReturnListener() {
  const { isAuthenticated } = useAuth();
  const { waitForPaidService } = useEntitlements();
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

      const isReady = await waitForPaidService();

      if (!isReady) {
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
  }, [isAuthenticated, waitForPaidService, refreshCompletion, showToast, t]);

  return null;
}
