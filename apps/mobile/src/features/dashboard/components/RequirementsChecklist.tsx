import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Text} from '@/components/ui/Text';
import {RequirementItem} from '@/features/dashboard/components/RequirementItem';
import {DASHBOARD_REQUIREMENTS_TITLE} from '@/features/dashboard/data/dashboardContent';
import {RequirementProgress} from '@/features/dashboard/types/UserProgress';
import {AutomationId, Requirement} from '@/features/home/types/TieStepDetail';

export type RequirementWithProgress = Requirement & {
  progress: RequirementProgress;
  hint?: string;
  isReferenced?: boolean;
};

type RequirementsChecklistProps = {
  requirements: RequirementWithProgress[];
  interactive?: boolean;
  onSelfDeclaredToggle: (label: string) => void;
  onAutomationPress: (automationId: AutomationId, label: string) => void;
  onViewAppointmentPress: (label: string) => void;
  onClearAutomationPress: (label: string) => void;
  onFormPress: (formId: string, label: string) => void;
};

export function RequirementsChecklist({
  requirements,
  interactive = true,
  onSelfDeclaredToggle,
  onAutomationPress,
  onViewAppointmentPress,
  onClearAutomationPress,
  onFormPress,
}: RequirementsChecklistProps) {
  const {styles} = useStyles(stylesheet);

  if (requirements.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text variant="titleMedium">{DASHBOARD_REQUIREMENTS_TITLE}</Text>
      <View style={styles.list}>
        {requirements.map(requirement => (
          <RequirementItem
            key={requirement.label}
            requirement={requirement}
            progress={requirement.progress}
            hint={requirement.hint}
            isReferenced={requirement.isReferenced}
            interactive={interactive}
            onSelfDeclaredToggle={() => onSelfDeclaredToggle(requirement.label)}
            onAutomationPress={() =>
              requirement.automationId
                ? onAutomationPress(requirement.automationId, requirement.label)
                : undefined
            }
            onViewAppointmentPress={() => onViewAppointmentPress(requirement.label)}
            onClearAutomationPress={() => onClearAutomationPress(requirement.label)}
            onFormPress={() =>
              requirement.formId
                ? onFormPress(requirement.formId, requirement.label)
                : undefined
            }
          />
        ))}
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    gap: theme.spacing.sm,
    maxWidth: theme.sizes.contentMaxWidth,
    alignSelf: 'center',
    width: '100%',
  },
  list: {
    gap: theme.spacing.xs,
  },
}));
