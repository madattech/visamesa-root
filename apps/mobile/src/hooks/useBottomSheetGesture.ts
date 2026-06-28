import {useRef} from 'react';
import {Animated, PanResponder} from 'react-native';

type UseBottomSheetGestureProps = {
  onClose: () => void;
  /** Threshold for dismissing (0-1, fraction of height) */
  dismissThreshold?: number;
};

/**
 * Hook for managing bottom sheet pan gesture and dismiss behavior.
 * Returns pan responder, animated translateY value, and dismiss handler.
 */
export function useBottomSheetGesture({
  onClose,
  dismissThreshold = 0.3,
}: UseBottomSheetGestureProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const sheetHeightRef = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to downward drags from top of sheet
        return gestureState.dy > 5 && Math.abs(gestureState.dx) < Math.abs(gestureState.dy);
      },
      onPanResponderGrant: () => {
        translateY.setOffset(0);
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow dragging down (positive dy)
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldDismiss =
          gestureState.dy > sheetHeightRef.current * dismissThreshold ||
          gestureState.vy > 0.5;

        if (shouldDismiss) {
          // Animate out and close
          Animated.timing(translateY, {
            toValue: sheetHeightRef.current,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            translateY.setValue(0);
            onClose();
          });
        } else {
          // Spring back to original position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
          }).start();
        }
      },
    }),
  ).current;

  const setSheetHeight = (height: number) => {
    sheetHeightRef.current = height;
  };

  return {
    panResponder,
    translateY,
    setSheetHeight,
  };
}
