import {LayoutAnimation, UIManager} from 'react-native';

import {motion} from '@/theme';

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function configureLayoutAnimation(): void {
  LayoutAnimation.configureNext({
    duration: motion.duration.normal,
    create: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
  });
}
