import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {HomeStackParamList, RootStackParamList} from '@/navigation/types';

type StepsScreenNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'Steps'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export type UseStepsScreenResult = {
  onStartAutomation: () => void;
  onBackPress: () => void;
};

export function useStepsScreen(
  navigation: StepsScreenNavigation,
): UseStepsScreenResult {
  const onStartAutomation = () => {
    navigation.navigate('WebsiteWebView', {});
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  return {
    onStartAutomation,
    onBackPress,
  };
}
