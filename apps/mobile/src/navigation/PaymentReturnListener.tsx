import { useEffect } from 'react';
import { Linking } from 'react-native';

import { useToast } from '@/components/Toast/ToastProvider';
import { useAuth } from '@/contexts/AuthContext';
import { useEntitlements } from '@/contexts/EntitlementsContext';
import { useProfileCompletion } from '@/contexts/ProfileCompletionContext';
import { navigateToDashboard } from '@/navigation/navigationRef';
import { navigationRef } from '@/navigation/navigationRef';

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

      if (!isReady) {
        showToast('Payment received — syncing your service');
        navigateToDashboard();
        return;
      }

      // Payment is ready, check profile completion
      const freshIsComplete = await refreshCompletion();

      if (freshIsComplete) {
        showToast('Your VisaMesa service is ready');
        navigateToDashboard();
      } else {
        showToast('Payment received — please complete your profile to start');
        navigationRef.navigate('MainTabs', {
          screen: 'ProfileTab',
          params: { screen: 'Profile' },
        } as never);
      }
    }

    void Linking.getInitialURL().then(handlePaymentReturn);

    const subscription = Linking.addEventListener('url', event => {
      void handlePaymentReturn(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated, waitForPaidService, refreshCompletion, showToast]);

  return null;
}
