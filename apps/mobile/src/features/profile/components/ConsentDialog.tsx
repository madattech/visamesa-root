import React, {useState} from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Dialog} from '@/components/ui/Dialog';
import {Text} from '@/components/ui/Text';
import {useAppDialog} from '@/contexts/AppDialogContext';
import {ProfileStackParamList} from '@/navigation/types';

type ConsentDialogNavigation = NativeStackNavigationProp<
  ProfileStackParamList,
  'ProfileSection'
>;

type ConsentDialogProps = {
  onAccept: () => Promise<void>;
  onDecline: () => void;
};

export function ConsentDialog({onAccept, onDecline}: ConsentDialogProps) {
  const {styles} = useStyles(stylesheet);
  const navigation = useNavigation<ConsentDialogNavigation>();
  const {showAlert} = useAppDialog();
  const {t} = useTranslation('profile');
  const {t: tCommon} = useTranslation('common');
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = async () => {
    if (isAccepting) {
      return;
    }

    setIsAccepting(true);

    try {
      await onAccept();
    } catch {
      showAlert(tCommon('errors.title'), t('consentDialog.recordFailed'));
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <Dialog
      visible={true}
      onClose={onDecline}
      title={t('consentDialog.title')}
      actions={[
        {
          label: t('consentDialog.decline'),
          onPress: onDecline,
          variant: 'outline',
        },
        {
          label: isAccepting ? t('consentDialog.accepting') : t('consentDialog.accept'),
          onPress: handleAccept,
          variant: 'primary',
        },
      ]}>
      <View style={styles.content}>
        <Text variant="bodyMedium">
          {t('consentDialog.message')}
        </Text>

        <View style={styles.links}>
          <Text
            variant="bodyMedium"
            color="primary"
            onPress={() => navigation.navigate('LegalDocument', {documentId: 'privacy'})}
            style={styles.link}>
            {t('consentDialog.privacyPolicy')}
          </Text>
          <Text variant="bodyMedium" color="onSurfaceVariant">
            {' • '}
          </Text>
          <Text
            variant="bodyMedium"
            color="primary"
            onPress={() => navigation.navigate('LegalDocument', {documentId: 'terms'})}
            style={styles.link}>
            {t('consentDialog.termsOfService')}
          </Text>
        </View>

        <Text variant="bodySmall" color="onSurfaceVariant">
          {t('consentDialog.gdprNote')}
        </Text>
      </View>
    </Dialog>
  );
}

const stylesheet = createStyleSheet(theme => ({
  content: {
    gap: theme.spacing.md,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  link: {
    textDecorationLine: 'underline',
  },
}));
