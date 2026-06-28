import React, {useState} from 'react';
import {Alert, Linking, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Dialog} from '@/components/ui/Dialog';
import {Text} from '@/components/ui/Text';
import {WEBSITE_BASE_URL} from '@/config/website';

type ConsentDialogProps = {
  onAccept: () => Promise<void>;
  onDecline: () => void;
};

export function ConsentDialog({onAccept, onDecline}: ConsentDialogProps) {
  const {styles} = useStyles(stylesheet);
  const [_isAccepting, setIsAccepting] = useState(false);

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
    } catch {
      Alert.alert('Error', 'Failed to record your consent. Please try again.');
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <Dialog
      visible={true}
      onClose={onDecline}
      title="Privacy & Data Protection"
      actions={[
        {
          label: 'Decline',
          onPress: onDecline,
          variant: 'outline',
        },
        {
          label: 'Accept & Continue',
          onPress: handleAccept,
          variant: 'primary',
        },
      ]}>
      <View style={styles.content}>
        <Text variant="bodyMedium">
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

        <Text variant="bodySmall" color="onSurfaceVariant">
          Your data is encrypted on your device and we follow EU GDPR
          regulations. You can delete your data at any time.
        </Text>
      </View>
    </Dialog>
  );
}

const stylesheet = createStyleSheet(theme => ({
  content: {
    gap: theme.spacing.md,
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
}));
