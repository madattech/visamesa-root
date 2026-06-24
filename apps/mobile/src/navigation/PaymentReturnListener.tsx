import { useEffect } from 'react';
import { Linking } from 'react-native';

import { useToast } from '@/components/Toast/ToastProvider';
import { useAuth } from '@/contexts/AuthContext';
import { useEntitlements } from '@/contexts/EntitlementsContext';
import { navigateToDashboard } from '@/navigation/navigationRef';

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
  const { showToast } = useToast();

  useEffect(() => {
    async function handlePaymentReturn(url: string | null) {
      if (!url || !isCheckoutSuccessUrl(url)) {
        return;
      }

      if (!isAuthenticated) {
        showToast('Sign in with the same Google account to unlock your service');
        return;
      }

      const isReady = await waitForPaidService();

      if (isReady) {
        showToast('Your VisaMesa service is ready');
      } else {
        showToast('Payment received — syncing your service');
      }

      navigateToDashboard();
    }

    void Linking.getInitialURL().then(handlePaymentReturn);

    const subscription = Linking.addEventListener('url', event => {
      void handlePaymentReturn(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated, waitForPaidService, showToast]);

  return null;
}
