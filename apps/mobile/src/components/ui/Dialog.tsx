import React, {useEffect, useRef} from 'react';
import {Animated, Modal, Pressable, View, StyleSheet} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Surface} from '@/components/ui/Surface';
import {Text} from '@/components/ui/Text';
import {Button} from '@/components/ui/Button';
import {SCRIM_OPACITY} from '@/theme/elevation';

export type DialogAction = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'tonal';
};

export type DialogProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  /** Message or custom content */
  children: React.ReactNode;
  /** Action buttons (up to 3 recommended) */
  actions?: DialogAction[];
};

export function Dialog({
  visible,
  onClose,
  title,
  children,
  actions,
}: DialogProps) {
  const {styles, theme} = useStyles(stylesheet);
  const scrimOpacity = useRef(new Animated.Value(0)).current;
  const dialogScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(scrimOpacity, {
          toValue: SCRIM_OPACITY,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(dialogScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 6,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scrimOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(dialogScale, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scrimOpacity, dialogScale]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={StyleSheet.absoluteFill}>
          <Pressable
            style={styles.scrimPressable}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close dialog">
            <Animated.View
              style={[
                styles.scrim,
                {
                  opacity: scrimOpacity,
                  backgroundColor: theme.colors.scrim,
                },
              ]}
            />
          </Pressable>
        </View>
        <Animated.View
          style={[
            styles.dialogContainer,
            {
              transform: [{scale: dialogScale}],
            },
          ]}>
          <Surface variant="elevated" elevation={3} style={styles.dialog}>
            <Text variant="titleMedium" style={styles.title}>
              {title}
            </Text>
            <View style={styles.content}>
              {typeof children === 'string' ? (
                <Text variant="bodyMedium" color="onSurfaceVariant">
                  {children}
                </Text>
              ) : (
                children
              )}
            </View>
            {actions && actions.length > 0 ? (
              <View style={styles.actions}>
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    label={action.label}
                    onPress={action.onPress}
                    variant={action.variant ?? 'tonal'}
                  />
                ))}
              </View>
            ) : null}
          </Surface>
        </Animated.View>
      </View>
    </Modal>
  );
}

const stylesheet = createStyleSheet(theme => ({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  scrimPressable: {
    flex: 1,
  },
  scrim: {
    flex: 1,
  },
  dialogContainer: {
    width: '100%',
    maxWidth: 400,
  },
  dialog: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  title: {
    // Title styling inherited from Text component
  },
  content: {
    // Content spacing
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
}));
