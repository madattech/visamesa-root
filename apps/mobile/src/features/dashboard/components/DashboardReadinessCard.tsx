import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
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
  const {t} = useTranslation('dashboard');

  const isPaymentMissing = missing.includes('payment');
  const isProfileMissing = missing.includes('profile');

  return (
    <Surface variant="elevated" elevation={1} style={styles.container}>
      <View style={styles.header}>
        <Icon name="info-outline" size="md" color="primary" />
        <Text variant="titleSmall" color="onSurface">
          {t('readinessTitle')}
        </Text>
      </View>

      <View style={styles.items}>
        <ReadinessItem
          label={t('readinessPayment')}
          isComplete={!isPaymentMissing}
        />
        <ReadinessItem
          label={t('readinessProfile')}
          isComplete={!isProfileMissing}
        />
      </View>

      {isPaymentMissing || isProfileMissing ? (
        <View style={styles.actions}>
          {isPaymentMissing ? (
            <Button
              label={t('getService')}
              variant="primary"
              onPress={onGetServicePress}
              fullWidth
            />
          ) : null}
          {isProfileMissing ? (
            <Button
              label={t('completeProfile')}
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
    maxWidth: theme.sizes.contentMaxWidth,
    alignSelf: 'center',
    width: '100%',
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
  },
}));
