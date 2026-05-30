import React from 'react';
import {LayoutAnimation, Platform, Pressable, UIManager, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Text} from '@/components/ui/Text';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type AccordionProps = {
  expandedId: string | null;
  onExpandedChange: (id: string | null) => void;
  children: React.ReactNode;
};

type AccordionItemProps = {
  id: string;
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

type ExpandableChildProps = {
  id: string;
  expanded?: boolean;
  onToggle?: () => void;
};

export function Accordion({
  expandedId,
  onExpandedChange,
  children,
}: AccordionProps) {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.list}>
      {React.Children.map(children, child => {
        if (
          !React.isValidElement<ExpandableChildProps>(child) ||
          !child.props.id
        ) {
          return child;
        }

        const itemId = child.props.id;

        return React.cloneElement(child, {
          expanded: expandedId === itemId,
          onToggle: () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            onExpandedChange(expandedId === itemId ? null : itemId);
          },
        });
      })}
    </View>
  );
}

export function AccordionItem({
  title,
  expanded,
  onToggle,
  children,
}: AccordionItemProps) {
  const {styles, theme} = useStyles(stylesheet);

  return (
    <View style={styles.item}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{expanded}}
        accessibilityLabel={title}
        android_ripple={{color: theme.colors.primaryContainer}}
        onPress={onToggle}
        style={({pressed}) => [
          styles.header,
          pressed && styles.headerPressed,
        ]}>
        <Text variant="titleMedium" style={styles.title}>
          {title}
        </Text>
        <Text variant="titleMedium" color="onSurfaceVariant">
          {expanded ? '▴' : '▾'}
        </Text>
      </Pressable>
      {expanded ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  list: {
    gap: theme.spacing.sm,
  },
  item: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    overflow: 'hidden',
  },
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  headerPressed: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  title: {
    flex: 1,
    fontWeight: '600',
    marginRight: theme.spacing.sm,
  },
  content: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
}));
