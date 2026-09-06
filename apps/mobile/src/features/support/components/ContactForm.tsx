import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Button} from '@/components/ui/Button';
import {Text} from '@/components/ui/Text';
import {TextField} from '@/components/ui/TextField';
import {ContextPreview} from '@/features/support/components/ContextPreview';

type ContactFormProps = {
  message: string;
  isSending: boolean;
  canSend: boolean;
  contextDisplayItems: Array<{label: string; value: string}>;
  email?: string;
  showEmailField?: boolean;
  onEmailChange?: (text: string) => void;
  onMessageChange: (text: string) => void;
  onSendMessage: () => void;
  onWhatsAppPress: () => void;
};

export function ContactForm({
  message,
  isSending,
  canSend,
  contextDisplayItems,
  email,
  showEmailField = false,
  onEmailChange,
  onMessageChange,
  onSendMessage,
  onWhatsAppPress,
}: ContactFormProps) {
  const {styles} = useStyles(stylesheet);
  const {t} = useTranslation('support');

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        {t('contactSectionTitle')}
      </Text>
      <Text variant="bodyMedium" color="onSurfaceVariant">
        {t('askAnything')}
      </Text>

      {showEmailField ? (
        <TextField
          label={t('emailLabel')}
          placeholder={t('emailPlaceholder')}
          value={email ?? ''}
          onChangeText={onEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          containerStyle={styles.textField}
        />
      ) : null}

      <TextField
        label={t('messageLabel')}
        placeholder={t('messagePlaceholder')}
        value={message}
        onChangeText={onMessageChange}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        containerStyle={styles.textField}
      />

      <ContextPreview items={contextDisplayItems} />

      <View style={styles.actions}>
        <Button
          label={isSending ? t('sendingMessage') : t('sendMessage')}
          onPress={onSendMessage}
          disabled={!canSend}
          variant="primary"
        />
        <Button
          label={t('whatsappButton')}
          onPress={onWhatsAppPress}
          variant="outline"
        />
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    gap: theme.spacing.md,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  textField: {
    marginTop: theme.spacing.sm,
  },
  actions: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
}));
