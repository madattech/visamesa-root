import {useRef} from 'react';
import {Animated} from 'react-native';

/**
 * Hook for managing collapsing header animation state.
 * Returns scrollY value and interpolated opacities for compact title and border.
 *
 * Animation thresholds:
 * - Large title visible: scrollY 0-40
 * - Transition: scrollY 40-80
 * - Compact title fully visible: scrollY 80+
 */
export function useCollapsingHeader() {
  const scrollY = useRef(new Animated.Value(0)).current;

  // Compact title fades in as user scrolls down
  const compactTitleOpacity = scrollY.interpolate({
    inputRange: [40, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Border appears as user scrolls down
  const borderOpacity = scrollY.interpolate({
    inputRange: [40, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  /**
   * Scroll to a specific Y position with animation.
   * Useful for scrolling expanded content into view.
   */
  const scrollToY = (scrollRef: React.RefObject<any>, y: number) => {
    scrollRef.current?.scrollTo({
      y,
      animated: true,
    });
  };

  return {
    scrollY,
    compactTitleOpacity,
    borderOpacity,
    scrollToY,
  };
}
