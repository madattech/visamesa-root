import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Button} from '@/components/ui/Button';
import {BottomSheet} from '@/components/ui/BottomSheet';
import {Icon} from '@/components/ui/Icon';
import {StatusIndicator} from '@/components/ui/StatusIndicator';
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
      <StatusIndicator status={isComplete ? 'done' : 'notDone'} size="md" />
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
  const {styles} = useStyles(stylesheet);

  const isPaymentMissing = missing.includes('payment');
  const isProfileMissing = missing.includes('profile');

  const footer = (
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
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={PREREQUISITES_MODAL_TITLE}
      footer={footer}>
      <View style={styles.header}>
        <Icon name="info-outline" size="md" color="primary" />
        <Text variant="bodyMedium" color="onSurfaceVariant">
          {PREREQUISITES_MODAL_DESCRIPTION}
        </Text>
      </View>

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
    </BottomSheet>
  );
}

const stylesheet = createStyleSheet(theme => ({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  items: {
    gap: theme.spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  actions: {
    gap: theme.spacing.sm,
  },
}));
