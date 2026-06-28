import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Dialog} from '@/components/ui/Dialog';
import {Icon} from '@/components/ui/Icon';
import {Surface} from '@/components/ui/Surface';
import {Text} from '@/components/ui/Text';
import {RequirementItem} from '@/features/dashboard/components/RequirementItem';
import {
  DASHBOARD_REQUIREMENTS_INFO_MESSAGE,
  DASHBOARD_REQUIREMENTS_INFO_TITLE,
  DASHBOARD_REQUIREMENTS_TITLE,
} from '@/features/dashboard/data/dashboardContent';
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
  const {styles, theme} = useStyles(stylesheet);
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  if (requirements.length === 0) {
    return null;
  }

  const content = (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text variant="titleMedium">{DASHBOARD_REQUIREMENTS_TITLE}</Text>
        <Pressable
          onPress={() => setShowInfoDialog(true)}
          accessibilityRole="button"
          accessibilityLabel="About Checklist"
          android_ripple={{
            color: theme.colors.primaryContainer,
            borderless: true,
            radius: 20,
          }}
          style={styles.infoButton}>
          <Icon name="info-outline" size="md" color="primary" />
        </Pressable>
      </View>
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
            onViewAppointmentPress={() =>
              onViewAppointmentPress(requirement.label)
            }
            onClearAutomationPress={() =>
              onClearAutomationPress(requirement.label)
            }
            onFormPress={() =>
              requirement.formId
                ? onFormPress(requirement.formId, requirement.label)
                : undefined
            }
          />
        ))}
      </View>
      <Dialog
        visible={showInfoDialog}
        onClose={() => setShowInfoDialog(false)}
        title={DASHBOARD_REQUIREMENTS_INFO_TITLE}
        actions={[
          {
            label: 'Got it',
            onPress: () => setShowInfoDialog(false),
            variant: 'tonal',
          },
        ]}>
        {DASHBOARD_REQUIREMENTS_INFO_MESSAGE}
      </Dialog>
    </View>
  );

  return (
    <Surface
      variant="elevated"
      elevation={2}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
        },
      ]}>
      {content}
    </Surface>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    maxWidth: theme.sizes.contentMaxWidth,
    alignSelf: 'center',
    width: '100%',
  },
  content: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoButton: {
    width: theme.sizes.touchTargetMin,
    height: theme.sizes.touchTargetMin,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    gap: theme.spacing.xs,
  },
}));
