import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {HomeStackParamList, RootStackParamList} from '@/navigation/types';

export function createMockNavigation<
  ParamList extends Record<string, object | undefined>,
  RouteName extends keyof ParamList,
>(): NativeStackNavigationProp<ParamList, RouteName> {
  return {
    navigate: jest.fn(),
    goBack: jest.fn(),
  } as unknown as NativeStackNavigationProp<ParamList, RouteName>;
}

export type StepsScreenNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'Steps'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export function createMockStepsNavigation(): StepsScreenNavigation {
  return createMockNavigation<
    HomeStackParamList,
    'Steps'
  >() as StepsScreenNavigation;
}
