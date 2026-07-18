import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';

import {Dialog, DialogAction} from '@/components/ui/Dialog';

export type AppAlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

export type ShowAlertOptions = {
  dismissable?: boolean;
};

export type AppDialogConfig = {
  title: string;
  message: React.ReactNode;
  actions?: DialogAction[];
  dismissable?: boolean;
};

type AppDialogContextValue = {
  showDialog: (config: AppDialogConfig) => void;
  showAlert: (
    title: string,
    message: React.ReactNode,
    buttons?: AppAlertButton[],
    options?: ShowAlertOptions,
  ) => void;
  closeDialog: () => void;
};

const AppDialogContext = createContext<AppDialogContextValue | null>(null);

const EMPTY_DIALOG: AppDialogConfig & {visible: boolean} = {
  visible: false,
  title: '',
  message: '',
  actions: [],
  dismissable: true,
};

function mapAlertButtons(
  buttons: AppAlertButton[],
  closeDialog: () => void,
): DialogAction[] {
  return buttons.map((button, index) => ({
    label: button.text,
    variant:
      button.style === 'cancel'
        ? 'outline'
        : button.style === 'destructive'
          ? 'destructive'
          : index === buttons.length - 1
            ? 'primary'
            : 'outline',
    onPress: () => {
      closeDialog();
      button.onPress?.();
    },
  }));
}

export function AppDialogProvider({children}: {children: React.ReactNode}) {
  const {t} = useTranslation('common');
  const [dialog, setDialog] = useState(EMPTY_DIALOG);

  const closeDialog = useCallback(() => {
    setDialog(prev => ({...prev, visible: false}));
  }, []);

  const showDialog = useCallback((config: AppDialogConfig) => {
    setDialog({
      ...config,
      visible: true,
      dismissable: config.dismissable ?? true,
      actions: config.actions?.map(action => ({
        ...action,
        onPress: () => {
          closeDialog();
          action.onPress();
        },
      })),
    });
  }, [closeDialog]);

  const showAlert = useCallback(
    (
      title: string,
      message: React.ReactNode,
      buttons: AppAlertButton[] = [{text: t('actions.ok')}],
      options: ShowAlertOptions = {},
    ) => {
      setDialog({
        visible: true,
        title,
        message,
        dismissable: options.dismissable ?? true,
        actions: mapAlertButtons(buttons, closeDialog),
      });
    },
    [closeDialog, t],
  );

  const value = useMemo(
    () => ({
      showDialog,
      showAlert,
      closeDialog,
    }),
    [closeDialog, showAlert, showDialog],
  );

  return (
    <AppDialogContext.Provider value={value}>
      {children}
      <Dialog
        visible={dialog.visible}
        onClose={closeDialog}
        title={dialog.title}
        dismissable={dialog.dismissable}
        actions={dialog.actions}>
        {dialog.message}
      </Dialog>
    </AppDialogContext.Provider>
  );
}

export function useAppDialog(): AppDialogContextValue {
  const context = useContext(AppDialogContext);

  if (!context) {
    throw new Error('useAppDialog must be used within AppDialogProvider');
  }

  return context;
}
