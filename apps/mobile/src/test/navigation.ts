import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {RootStackParamList} from '@/navigation/RootNavigator';

export function createMockNavigation<
  T extends keyof RootStackParamList,
>(): NativeStackNavigationProp<RootStackParamList, T> {
  return {
    navigate: jest.fn(),
    goBack: jest.fn(),
  } as unknown as NativeStackNavigationProp<RootStackParamList, T>;
}
