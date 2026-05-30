import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {StepsDevActionId} from '@/features/home/data/stepsScreenContent';
import {
  HomeStackParamList,
  RootStackParamList,
  WebViewAutomationKind,
} from '@/navigation/types';

type StepsScreenNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'Steps'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export type UseStepsScreenResult = {
  onDevActionPress: (actionId: StepsDevActionId) => void;
};

const DEV_ACTION_AUTOMATION: Record<StepsDevActionId, WebViewAutomationKind> = {
  citaPrevia: 'cita-previa',
  empadronamiento: 'empadronamiento',
};

const openAutomation = (
  navigation: StepsScreenNavigation,
  automation: WebViewAutomationKind,
) => {
  navigation.navigate('WebsiteWebView', {automation});
};

export function useStepsScreen(
  navigation: StepsScreenNavigation,
): UseStepsScreenResult {
  const onDevActionPress = (actionId: StepsDevActionId) => {
    openAutomation(navigation, DEV_ACTION_AUTOMATION[actionId]);
  };

  return {
    onDevActionPress,
  };
}
