import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {CollapsingHeaderScreen} from '@/components/layout/CollapsingHeaderScreen';
import {Text} from '@/components/ui/Text';
import {FAQSection} from '@/features/support/components/FAQSection';
import {ContactForm} from '@/features/support/components/ContactForm';
import {useSupportScreen} from '@/features/support/hooks/useSupportScreen';

function SupportScreen() {
  const {styles, theme} = useStyles(stylesheet);
  const {t} = useTranslation('support');

  const {
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
  } = useSupportScreen();

  if (isLoading) {
    return (
      <CollapsingHeaderScreen title={t('title')}>
        <View style={styles.centered}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      </CollapsingHeaderScreen>
    );
  }

  return (
    <CollapsingHeaderScreen title={t('title')} keyboardAvoiding>
      {supportContext?.currentStepId != null && (
        <View style={styles.contextBadge}>
          <Text variant="labelMedium" color="onSurfaceVariant">
            {t('currentStepBadge', {stepId: supportContext.currentStepId})}
          </Text>
        </View>
      )}

      <FAQSection faqs={faqs} />

      <View style={styles.divider} />

      <ContactForm
        message={message}
        isSending={isSending}
        canSend={canSend}
        contextDisplayItems={contextDisplayItems}
        email={email}
        showEmailField={!isAuthenticated}
        onEmailChange={onEmailChange}
        onMessageChange={onMessageChange}
        onSendMessage={onSendMessage}
        onWhatsAppPress={onWhatsAppPress}
      />
    </CollapsingHeaderScreen>
  );
}

const stylesheet = createStyleSheet(theme => ({
  centered: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  contextBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surfaceContainer,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radii.sm,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.outlineVariant,
    marginVertical: theme.spacing.sm,
  },
}));

export default SupportScreen;
