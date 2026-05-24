import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {RootStackParamList} from '@/navigation/RootNavigator';

type StepsScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  'Steps'
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
