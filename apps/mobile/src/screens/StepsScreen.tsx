import React from 'react';
import {ScrollView} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Button} from '@/components/ui/Button';
import {Text} from '@/components/ui/Text';
import {
  STEPS_DEV_ACTIONS,
  STEPS_SCREEN_DESCRIPTION,
} from '@/features/home/data/stepsScreenContent';
import {useStepsScreen} from '@/features/home/hooks/useStepsScreen';
import {HomeStackParamList, RootStackParamList} from '@/navigation/types';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type StepsScreenNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'Steps'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type StepsScreenProps = {
  navigation: StepsScreenNavigation;
};

const StepsScreen = ({navigation}: StepsScreenProps) => {
  const {styles} = useStyles(stylesheet);
  const {onDevActionPress} = useStepsScreen(navigation);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <Text variant="bodyLarge" color="onSurfaceVariant" style={styles.description}>
        {STEPS_SCREEN_DESCRIPTION}
      </Text>
      {__DEV__
        ? STEPS_DEV_ACTIONS.map(action => (
            <Button
              key={action.id}
              label={action.label}
              variant="outline"
              onPress={() => onDevActionPress(action.id)}
              fullWidth
            />
          ))
        : null}
    </ScrollView>
  );
};

const stylesheet = createStyleSheet(theme => ({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
    maxWidth: theme.sizes.contentMaxWidth,
    alignSelf: 'center',
    width: '100%',
  },
  description: {
    textAlign: 'center',
  },
}));

export default StepsScreen;
