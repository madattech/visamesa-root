import React from 'react';
import {LayoutAnimation, Platform, Pressable, UIManager, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Surface} from '@/components/ui/Surface';
import {Text} from '@/components/ui/Text';
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
            LayoutAnimation.configureNext({
              duration: motion.duration.normal,
              create: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity,
              },
              update: {type: LayoutAnimation.Types.easeInEaseOut},
            });
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
    <Surface variant="outlined" style={styles.item}>
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
    </Surface>
  );
}

const stylesheet = createStyleSheet(theme => ({
  list: {
    gap: theme.spacing.sm,
  },
  item: {
    overflow: 'hidden',
  },
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
