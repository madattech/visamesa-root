import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Accordion} from '@/components/Accordion/Accordion';
import {ProfileFormSection} from '@/features/profile/components/ProfileFormSection';
import {ProfileSectionId} from '@/features/profile/hooks/useProfileScreen';

type ProfileSectionListProps = {
  expandedSection: ProfileSectionId | null;
  onExpandedChange: (sectionId: ProfileSectionId | null) => void;
  personalInitialValues: Record<string, unknown>;
  billingInitialValues: Record<string, unknown>;
  residenceInitialValues: Record<string, unknown>;
  isSubmittingPersonal: boolean;
  isSubmittingBilling: boolean;
  isSubmittingResidenceRegistration: boolean;
  onPersonalSubmit: (data: Record<string, unknown>) => Promise<void>;
  onBillingSubmit: (data: Record<string, unknown>) => Promise<void>;
  onResidenceSubmit: (data: Record<string, unknown>) => Promise<void>;
};

export function ProfileSectionList({
  expandedSection,
  onExpandedChange,
  personalInitialValues,
  billingInitialValues,
  residenceInitialValues,
  isSubmittingPersonal,
  isSubmittingBilling,
  isSubmittingResidenceRegistration,
  onPersonalSubmit,
  onBillingSubmit,
  onResidenceSubmit,
}: ProfileSectionListProps) {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Accordion
        expandedId={expandedSection}
        onExpandedChange={id => onExpandedChange(id as ProfileSectionId | null)}>
        <ProfileFormSection
          id="personal"
          title="Personal Information"
          formId="profile-personal"
          initialValues={personalInitialValues}
          onSubmit={onPersonalSubmit}
          isSubmitting={isSubmittingPersonal}
        />
        <ProfileFormSection
          id="billing"
          title="Billing & Bank Details"
          formId="profile-billing"
          initialValues={billingInitialValues}
          onSubmit={onBillingSubmit}
          isSubmitting={isSubmittingBilling}
        />
        <ProfileFormSection
          id="residenceRegistration"
          title="Residence Registration"
          formId="profile-residence-registration"
          initialValues={residenceInitialValues}
          onSubmit={onResidenceSubmit}
          isSubmitting={isSubmittingResidenceRegistration}
        />
      </Accordion>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    gap: theme.spacing.sm,
  },
}));
