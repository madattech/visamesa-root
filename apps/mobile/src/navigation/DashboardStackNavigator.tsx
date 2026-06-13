import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {tieStepsDetail} from '@/features/home/data/stepsData';
import {useInternalStackScreenOptions} from '@/navigation/internalStackScreenOptions';
import DashboardScreen from '@/screens/DashboardScreen';
import DashboardStepDetailScreen from '@/screens/DashboardStepDetailScreen';
import {getStepShortLabel} from '@/utils/stepLabel';

import {DashboardStackParamList} from './types';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

function getStepHeaderTitle(stepId: number): string {
  const step = tieStepsDetail.find(item => item.id === stepId);
  if (!step) {
    return 'Step details';
  }

  return `Step ${stepId}: ${getStepShortLabel(step.title)}`;
}

const DashboardStackNavigator = () => {
  const internalStackScreenOptions = useInternalStackScreenOptions();

  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        contentStyle: internalStackScreenOptions.contentStyle,
      }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen
        name="StepDetail"
        component={DashboardStepDetailScreen}
        options={({route}) => ({
          ...internalStackScreenOptions,
          title: getStepHeaderTitle(route.params.stepId),
        })}
      />
    </Stack.Navigator>
  );
};

export default DashboardStackNavigator;
