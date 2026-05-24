import React from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {ButtonGroup} from '@/components/ui/ButtonGroup';
import {Text} from '@/components/ui/Text';
import {useStepsScreen} from '@/features/home/hooks/useStepsScreen';
import {RootStackParamList} from '@/navigation/RootNavigator';

type StepsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Steps'>;
};

const StepsScreen = ({navigation}: StepsScreenProps) => {
  const {styles} = useStyles(stylesheet);
  const {onStartAutomation, onBackPress} = useStepsScreen(navigation);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <ButtonGroup
          primaryButton={{
            label: 'Start Automation',
            onPress: onStartAutomation,
          }}
          secondaryButton={{
            label: 'Back',
            onPress: onBackPress,
          }}
        />
      </View>
      <View style={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>
          TIE Steps
        </Text>
      </View>
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: theme.spacing.sm,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
  },
}));

export default StepsScreen;
