import React from 'react';
import {LayoutAnimation, Platform, Pressable, UIManager, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Surface} from '@/components/ui/Surface';
import {Text} from '@/components/ui/Text';
import {Icon} from '@/components/ui/Icon';
import {motion} from '@/theme';

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
  /** Optional callback when an item expands, receives the Y offset to scroll to */
  onExpand?: (layoutY: number) => void;
};

type AccordionItemProps = {
  id: string;
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  onExpand?: (layoutY: number) => void;
};

type ExpandableChildProps = {
  id: string;
  expanded?: boolean;
  onToggle?: () => void;
  onExpand?: (layoutY: number) => void;
};

export function Accordion({
  expandedId,
  onExpandedChange,
  children,
  onExpand,
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
            LayoutAnimation.configureNext({
              duration: motion.duration.normal,
              create: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity,
              },
              update: {type: LayoutAnimation.Types.easeInEaseOut},
            });
            const wasExpanded = expandedId === itemId;
            onExpandedChange(wasExpanded ? null : itemId);
          },
          onExpand,
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
    <Surface
      variant="elevated"
      elevation={2}
      style={[
        styles.item,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
        },
      ]}>
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
        <Icon
          name={expanded ? 'expand-less' : 'expand-more'}
          size="md"
          color="onSurfaceVariant"
        />
      </Pressable>
      {expanded ? <View style={styles.content}>{children}</View> : null}
    </Surface>
  );
}

const stylesheet = createStyleSheet(theme => ({
  list: {
    gap: theme.spacing.sm,
  },
  item: {},
  header: {
    minHeight: theme.sizes.touchTargetMin + theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  headerPressed: {
    backgroundColor: theme.colors.surfaceContainer,
  },
  title: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  content: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
}));
