import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Button} from '@/components/ui/Button';
import {Icon} from '@/components/ui/Icon';
import {Surface} from '@/components/ui/Surface';
import {Text} from '@/components/ui/Text';
import {ProcessReadinessMissing} from '@/hooks/useProcessReadiness';

type ReadinessItemProps = {
  label: string;
  isComplete: boolean;
};

function ReadinessItem({label, isComplete}: ReadinessItemProps) {
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

type DashboardReadinessCardProps = {
  missing: ProcessReadinessMissing[];
  onGetServicePress: () => void;
  onCompleteProfilePress: () => void;
};

export function DashboardReadinessCard({
  missing,
  onGetServicePress,
  onCompleteProfilePress,
}: DashboardReadinessCardProps) {
  const {styles} = useStyles(stylesheet);

  const isPaymentMissing = missing.includes('payment');
  const isProfileMissing = missing.includes('profile');

  return (
    <Surface variant="elevated" elevation={1} style={styles.container}>
      <View style={styles.header}>
        <Icon name="info-outline" size="md" color="primary" />
        <Text variant="titleSmall" color="onSurface">
          Before we can start
        </Text>
      </View>

      <View style={styles.items}>
        <ReadinessItem
          label="VisaMesa service payment"
          isComplete={!isPaymentMissing}
        />
        <ReadinessItem
          label="Complete your profile"
          isComplete={!isProfileMissing}
        />
      </View>

      {isPaymentMissing || isProfileMissing ? (
        <View style={styles.actions}>
          {isPaymentMissing ? (
            <Button
              label="Get service"
              variant="primary"
              onPress={onGetServicePress}
              fullWidth
            />
          ) : null}
          {isProfileMissing ? (
            <Button
              label="Complete profile"
              variant={isPaymentMissing ? 'outline' : 'primary'}
              onPress={onCompleteProfilePress}
              fullWidth
            />
          ) : null}
        </View>
      ) : null}
    </Surface>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
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
    marginTop: theme.spacing.xs,
  },
}));
