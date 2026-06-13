import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  ViewStyle,
} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {useTabBarInset} from '@/navigation/useTabBarInset';

type InternalDetailScreenLayoutProps = {
  children: React.ReactNode;
  keyboardAvoiding?: boolean;
  contentContainerStyle?: ViewStyle;
  scrollViewProps?: Omit<ScrollViewProps, 'contentContainerStyle' | 'children'>;
};

export function InternalDetailScreenLayout({
  children,
  keyboardAvoiding = false,
  contentContainerStyle,
  scrollViewProps,
}: InternalDetailScreenLayoutProps) {
  const {styles, theme} = useStyles(stylesheet);
  const tabBarInset = useTabBarInset();

  const scrollView = (
    <ScrollView
      {...scrollViewProps}
      style={[styles.flex, scrollViewProps?.style]}
      contentContainerStyle={[
        styles.scrollContent,
        {paddingBottom: theme.spacing.lg + tabBarInset},
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );

  if (!keyboardAvoiding) {
    return scrollView;
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {scrollView}
    </KeyboardAvoidingView>
  );
}

const stylesheet = createStyleSheet(theme => ({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.md,
    maxWidth: theme.sizes.contentMaxWidth,
    alignSelf: 'center',
    width: '100%',
  },
}));
