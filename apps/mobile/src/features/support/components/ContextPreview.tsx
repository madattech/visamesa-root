import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Icon} from '@/components/ui/Icon';
import {Surface} from '@/components/ui/Surface';
import {Text} from '@/components/ui/Text';
import {configureLayoutAnimation} from '@/utils/layoutAnimation';

type ContextPreviewProps = {
  items: Array<{label: string; value: string}>;
};

export function ContextPreview({items}: ContextPreviewProps) {
  const {styles, theme} = useStyles(stylesheet);
  const {t} = useTranslation('support');
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    configureLayoutAnimation();
    setExpanded(prev => !prev);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Surface
      variant="elevated"
      elevation={1}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surfaceContainer,
          borderRadius: theme.radii.md,
        },
      ]}>
      <Pressable
        onPress={toggleExpanded}
        accessibilityRole="button"
        accessibilityState={{expanded}}
        accessibilityLabel={t('contextTitle')}
        android_ripple={{color: theme.colors.primaryContainer}}
        style={styles.header}>
        <View style={styles.headerContent}>
          <Icon name="info-outline" size="sm" color="onSurfaceVariant" />
          <View style={styles.headerText}>
            <Text variant="labelMedium" color="onSurfaceVariant">
              {t('contextTitle')}
            </Text>
            {!expanded && (
              <Text variant="bodySmall" color="onSurfaceVariant">
                {t('contextDescription')}
              </Text>
            )}
          </View>
        </View>
        <Icon
          name={expanded ? 'expand-less' : 'expand-more'}
          size="md"
          color="onSurfaceVariant"
        />
      </Pressable>
      {expanded && (
        <View style={styles.content}>
          {items.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text variant="bodySmall" color="onSurfaceVariant">
                {item.label}
              </Text>
              <Text variant="bodySmall" style={styles.value}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Surface>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: theme.sizes.touchTargetMin,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    flex: 1,
  },
  headerText: {
    flex: 1,
    gap: theme.spacing.xs / 2,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  value: {
    color: theme.colors.onSurface,
    textAlign: 'right',
    flexShrink: 1,
  },
}));
