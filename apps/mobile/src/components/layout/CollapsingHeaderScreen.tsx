import React, {useRef} from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollViewProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {useNavigation} from '@react-navigation/native';

import {Icon} from '@/components/ui/Icon';
import {Text} from '@/components/ui/Text';
import {CollapsingHeaderProvider} from '@/contexts/CollapsingHeaderContext';
import {useCollapsingHeader} from '@/hooks/useCollapsingHeader';
import {useContentBottomInset} from '@/navigation/useContentBottomInset';

export type CollapsingHeaderScreenProps = {
  /** Large title displayed at top of content */
  title: string;
  /** Scroll content */
  children: React.ReactNode;
  /** Enable keyboard avoiding behavior */
  keyboardAvoiding?: boolean;
  /** Additional content container styles */
  contentContainerStyle?: ViewStyle;
  /** Additional scroll view props */
  scrollViewProps?: Omit<
    ScrollViewProps,
    'contentContainerStyle' | 'children' | 'onScroll' | 'scrollEventThrottle'
  >;
  /** Callback when scroll position changes (receives scrollY) */
  onScrollChange?: (scrollY: number) => void;
};

export function CollapsingHeaderScreen({
  title,
  children,
  keyboardAvoiding = false,
  contentContainerStyle,
  scrollViewProps,
  onScrollChange,
}: CollapsingHeaderScreenProps) {
  const {styles, theme} = useStyles(stylesheet);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const contentBottomInset = useContentBottomInset();
  const scrollRef = useRef<any>(null);

  const {scrollY, compactTitleOpacity, borderOpacity, scrollToY: baseScrollToY} =
    useCollapsingHeader();

  const scrollToY = (y: number) => {
    baseScrollToY(scrollRef, y);
  };

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {
      useNativeDriver: false, // Need to read value for onScrollChange
      listener: (event: any) => {
        if (onScrollChange) {
          onScrollChange(event.nativeEvent.contentOffset.y);
        }
      },
    },
  );

  const canGoBack = navigation.canGoBack();
  const backIconName = Platform.OS === 'ios' ? 'chevron-left' : 'arrow-back';

  const stickyHeader = (
    <View
      style={[
        styles.stickyHeader,
        {
          paddingTop: insets.top,
        },
      ]}>
      <View style={styles.headerContent}>
        {canGoBack && (
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            android_ripple={{
              color: theme.colors.primaryContainer,
              borderless: true,
              radius: 20,
            }}>
            <Icon name={backIconName} size="lg" color="primary" />
          </Pressable>
        )}
        <Animated.View style={[styles.compactTitleContainer, {opacity: compactTitleOpacity}]}>
          <Text variant="titleLarge" numberOfLines={1}>
            {title}
          </Text>
        </Animated.View>
      </View>
      <Animated.View
        style={[
          styles.headerBorder,
          {
            opacity: borderOpacity,
            borderBottomColor: theme.colors.outlineVariant,
          },
        ]}
      />
    </View>
  );

  const scrollContent = (
    <Animated.ScrollView
      ref={scrollRef}
      {...scrollViewProps}
      style={[styles.flex, scrollViewProps?.style]}
      contentContainerStyle={[
        styles.scrollContent,
        {paddingBottom: theme.spacing.lg + contentBottomInset},
        contentContainerStyle,
      ]}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <Text variant="headlineMedium" style={styles.largeTitle}>
        {title}
      </Text>
      {children}
    </Animated.ScrollView>
  );

  const layout = keyboardAvoiding ? (
    <View style={styles.container}>
      {stickyHeader}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scrollContent}
      </KeyboardAvoidingView>
    </View>
  ) : (
    <View style={styles.container}>
      {stickyHeader}
      {scrollContent}
    </View>
  );

  return (
    <CollapsingHeaderProvider value={{scrollToY}}>{layout}</CollapsingHeaderProvider>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: {
    flex: 1,
  },
  stickyHeader: {
    backgroundColor: theme.colors.background,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: theme.sizes.touchTargetMin,
    paddingHorizontal: theme.layout.screenPaddingX,
  },
  backButton: {
    width: theme.sizes.touchTargetMin,
    height: theme.sizes.touchTargetMin,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -theme.spacing.sm,
  },
  compactTitleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBorder: {
    height: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.layout.screenPaddingX,
    paddingTop: theme.layout.titleGap,
    gap: theme.spacing.md,
    maxWidth: theme.sizes.contentMaxWidth,
    alignSelf: 'center',
    width: '100%',
  },
  largeTitle: {
    // Large title at top of scroll content (will scroll away)
  },
}));
