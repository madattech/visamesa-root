import React from 'react';
import {Modal, Pressable, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Button} from '@/components/ui/Button';
import {Icon} from '@/components/ui/Icon';
import {Text} from '@/components/ui/Text';
import {
  PREREQUISITES_MODAL_TITLE,
  PREREQUISITES_MODAL_DESCRIPTION,
  PREREQUISITES_PAYMENT_LABEL,
  PREREQUISITES_PROFILE_LABEL,
  PREREQUISITES_GET_SERVICE_BUTTON,
  PREREQUISITES_COMPLETE_PROFILE_BUTTON,
} from '@/features/home/data/prerequisitesContent';
import {ProcessReadinessMissing} from '@/hooks/useProcessReadiness';

type PrerequisiteItemProps = {
  label: string;
  isComplete: boolean;
};

function PrerequisiteItem({label, isComplete}: PrerequisiteItemProps) {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.item}>
      <Icon
        name={isComplete ? 'check-circle' : 'radio-button-unchecked'}
        size="md"
        color={isComplete ? 'success' : 'onSurfaceVariant'}
      />
      <Text
        variant="bodyMedium"
        color={isComplete ? 'onSurface' : 'onSurfaceVariant'}>
        {label}
      </Text>
    </View>
  );
}

type ProcessPrerequisitesModalProps = {
  visible: boolean;
  missing: ProcessReadinessMissing[];
  onClose: () => void;
  onGetServicePress: () => void;
  onCompleteProfilePress: () => void;
};

export function ProcessPrerequisitesModal({
  visible,
  missing,
  onClose,
  onGetServicePress,
  onCompleteProfilePress,
}: ProcessPrerequisitesModalProps) {
  const {styles, theme} = useStyles(stylesheet);

  const isPaymentMissing = missing.includes('payment');
  const isProfileMissing = missing.includes('profile');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable
        style={styles.backdrop}
        accessibilityRole="button"
        accessibilityLabel="Close prerequisites"
        onPress={onClose}
      />
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Icon name="info-outline" size="md" color="primary" />
          <Text variant="titleMedium" style={styles.title}>
            {PREREQUISITES_MODAL_TITLE}
          </Text>
        </View>

        <Text variant="bodyMedium" color="onSurfaceVariant" style={styles.description}>
          {PREREQUISITES_MODAL_DESCRIPTION}
        </Text>

        <View style={styles.items}>
          <PrerequisiteItem
            label={PREREQUISITES_PAYMENT_LABEL}
            isComplete={!isPaymentMissing}
          />
          <PrerequisiteItem
            label={PREREQUISITES_PROFILE_LABEL}
            isComplete={!isProfileMissing}
          />
        </View>

        <View style={styles.actions}>
          {isPaymentMissing ? (
            <Button
              label={PREREQUISITES_GET_SERVICE_BUTTON}
              variant="primary"
              onPress={onGetServicePress}
              fullWidth
            />
          ) : null}
          {isProfileMissing ? (
            <Button
              label={PREREQUISITES_COMPLETE_PROFILE_BUTTON}
              variant={isPaymentMissing ? 'outline' : 'primary'}
              onPress={onCompleteProfilePress}
              fullWidth
            />
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const stylesheet = createStyleSheet(theme => ({
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.scrim,
    opacity: 0.32,
  },
  sheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radii.lg,
    borderTopRightRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  title: {
    fontWeight: '600',
  },
  description: {
    marginTop: -theme.spacing.xs,
  },
  items: {
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  actions: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
}));
