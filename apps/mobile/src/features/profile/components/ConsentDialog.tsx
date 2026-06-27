import React, {useState} from 'react';
import {Alert, Linking, StyleSheet, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Button} from '@/components/ui/Button';
import {Surface} from '@/components/ui/Surface';
import {Text} from '@/components/ui/Text';
import {WEBSITE_BASE_URL} from '@/config/website';

type ConsentDialogProps = {
  onAccept: () => Promise<void>;
  onDecline: () => void;
};

export function ConsentDialog({onAccept, onDecline}: ConsentDialogProps) {
  const {styles, theme} = useStyles(stylesheet);
  const [isAccepting, setIsAccepting] = useState(false);

  const handleLinkPress = (path: string) => {
    const url = `${WEBSITE_BASE_URL}${path}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open the link');
    });
  };

  const handleAccept = async () => {
    setIsAccepting(true);

    try {
      await onAccept();
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to record your consent. Please try again.',
      );
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <View style={styles.overlay}>
      <Surface variant="elevated" elevation={3} style={styles.dialog}>
        <Text variant="titleMedium" style={styles.title}>
          Privacy & Data Protection
        </Text>

        <Text variant="bodyMedium" style={styles.message}>
          Before saving your personal information, please review and accept our
          data protection policies.
        </Text>

        <View style={styles.links}>
          <Text
            variant="bodyMedium"
            color="primary"
            onPress={() => handleLinkPress('/privacy')}
            style={styles.link}>
            Privacy Policy
          </Text>
          <Text variant="bodyMedium" color="onSurfaceVariant">
            {' • '}
          </Text>
          <Text
            variant="bodyMedium"
            color="primary"
            onPress={() => handleLinkPress('/terms')}
            style={styles.link}>
            Terms of Service
          </Text>
        </View>

        <Text variant="bodySmall" color="onSurfaceVariant" style={styles.note}>
          Your data is encrypted on your device and we follow EU GDPR
          regulations. You can delete your data at any time.
        </Text>

        <View style={styles.actions}>
          <Button
            label="Decline"
            variant="outline"
            onPress={onDecline}
            disabled={isAccepting}
            style={styles.button}
          />
          <Button
            label="Accept & Continue"
            variant="primary"
            onPress={handleAccept}
            disabled={isAccepting}
            style={styles.button}
          />
        </View>
      </Surface>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  dialog: {
    width: '100%',
    maxWidth: 400,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  link: {
    textDecorationLine: 'underline',
  },
  note: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  button: {
    flex: 1,
  },
}));
