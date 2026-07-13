import React from 'react';
import MaterialIcons from '@react-native-vector-icons/material-icons';

export const DASHBOARD_EMPTY_ICON: React.ComponentProps<
  typeof MaterialIcons
>['name'] = 'dashboard';

type AppointmentDetails = {
  office: string;
  date: string;
  time: string;
  location?: string;
  confirmationCode?: string;
  isPlaceholder?: boolean;
};

type DashboardTranslate = (
  key:
    | 'appointmentDetailsPlaceholder'
    | 'appointmentOffice'
    | 'appointmentDate'
    | 'appointmentTime'
    | 'appointmentLocation'
    | 'appointmentConfirmation',
  options?: Record<string, string>,
) => string;

export function formatAppointmentDetailsMessage(
  t: DashboardTranslate,
  appointment?: AppointmentDetails,
): string {
  if (!appointment || appointment.isPlaceholder) {
    return t('appointmentDetailsPlaceholder');
  }

  const lines = [
    t('appointmentOffice', {office: appointment.office}),
    t('appointmentDate', {date: appointment.date}),
    t('appointmentTime', {time: appointment.time}),
  ];

  if (appointment.location) {
    lines.push(t('appointmentLocation', {location: appointment.location}));
  }

  if (appointment.confirmationCode) {
    lines.push(
      t('appointmentConfirmation', {code: appointment.confirmationCode}),
    );
  }

  return lines.join('\n');
}
