import React from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Button} from '@/components/ui/Button';
import {Text} from '@/components/ui/Text';
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
  const {onCitaPreviaPress, onEmpadronamientoPress, onBackPress} =
    useStepsScreen(navigation);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.actions}>
          <Button
            label="Cita Previa"
            onPress={onCitaPreviaPress}
            fullWidth
            style={styles.button}
          />
          <Button
            label="Empadronamiento"
            onPress={onEmpadronamientoPress}
            variant="outline"
            fullWidth
            style={styles.button}
          />
          <Button
            label="Back"
            onPress={onBackPress}
            variant="outline"
            fullWidth
            style={styles.button}
          />
        </View>
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
  actions: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm + 4,
  },
  button: {
    width: '100%',
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
