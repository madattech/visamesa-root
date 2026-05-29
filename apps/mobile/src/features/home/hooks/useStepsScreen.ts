import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

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
  onCitaPreviaPress: () => void;
  onEmpadronamientoPress: () => void;
  onBackPress: () => void;
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
  const onCitaPreviaPress = () => {
    openAutomation(navigation, 'cita-previa');
  };

  const onEmpadronamientoPress = () => {
    openAutomation(navigation, 'empadronamiento');
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  return {
    onCitaPreviaPress,
    onEmpadronamientoPress,
    onBackPress,
  };
};
