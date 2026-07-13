import React from 'react';
import {useTranslation} from 'react-i18next';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {Button} from '@/components/ui/Button';
import {Text} from '@/components/ui/Text';
import {CollapsingHeaderScreen} from '@/components/layout/CollapsingHeaderScreen';
import {STEPS_DEV_ACTIONS} from '@/features/home/data/stepsScreenContent';
import {useStepsScreen} from '@/features/home/hooks/useStepsScreen';
import {HomeStackParamList, RootStackParamList} from '@/navigation/types';

type StepsScreenNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'Steps'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type StepsScreenProps = {
  navigation: StepsScreenNavigation;
};

const StepsScreen = ({navigation}: StepsScreenProps) => {
  const {styles} = useStyles(stylesheet);
  const {t} = useTranslation('tieSteps');
  const {onDevActionPress} = useStepsScreen(navigation);

  return (
    <CollapsingHeaderScreen title={t('screenTitle')}>
      <Text variant="bodyLarge" color="onSurfaceVariant" style={styles.description}>
        {t('screenDescription')}
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
    </CollapsingHeaderScreen>
  );
};

const stylesheet = createStyleSheet(() => ({
  description: {
    textAlign: 'center',
  },
}));

export default StepsScreen;
