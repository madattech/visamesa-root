import React from 'react';
import {View} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {CollapsingHeaderScreen} from '@/components/layout/CollapsingHeaderScreen';
import {Button} from '@/components/ui/Button';
import {Text} from '@/components/ui/Text';
import {LegalDocumentBlocks} from '@/features/legal/components/LegalDocumentBlocks';
import {useLegalDocumentScreen} from '@/features/legal/hooks/useLegalDocumentScreen';
import {ProfileStackParamList} from '@/navigation/types';

type LegalDocumentRoute = RouteProp<ProfileStackParamList, 'LegalDocument'>;

const LegalDocumentScreen = () => {
  const route = useRoute<LegalDocumentRoute>();
  const {styles} = useStyles(stylesheet);
  const {
    title,
    lastUpdated,
    intro,
    disclaimerTitle,
    disclaimerParagraphs,
    blocks,
    isAccepted,
    isAccepting,
    acceptLabel,
    acceptedLabel,
    onAcceptPress,
    onPrivacyLinkPress,
  } = useLegalDocumentScreen(route.params.documentId);

  return (
    <CollapsingHeaderScreen title={title}>
      <View style={styles.content}>
        <Text variant="bodySmall" color="onSurfaceVariant">
          {lastUpdated}
        </Text>

        <Text variant="bodyMedium">{intro}</Text>

        {disclaimerTitle ? (
          <View style={styles.section}>
            <Text variant="titleSmall">{disclaimerTitle}</Text>
            {disclaimerParagraphs.map(paragraph => (
              <Text
                key={paragraph}
                variant="bodyMedium"
                color="onSurfaceVariant"
                style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
          </View>
        ) : null}

        <LegalDocumentBlocks
          blocks={blocks}
          onPrivacyLinkPress={onPrivacyLinkPress}
        />

        {isAccepted ? (
          <View style={styles.acceptedBanner}>
            <Text variant="labelLarge" color="primary">
              {acceptedLabel}
            </Text>
          </View>
        ) : (
          <Button
            label={isAccepting ? `${acceptLabel}…` : acceptLabel}
            onPress={onAcceptPress}
            disabled={isAccepting}
            fullWidth
          />
        )}
      </View>
    </CollapsingHeaderScreen>
  );
};

const stylesheet = createStyleSheet(theme => ({
  content: {
    gap: theme.spacing.md,
  },
  section: {
    gap: theme.spacing.sm,
  },
  paragraph: {
    lineHeight: 22,
  },
  acceptedBanner: {
    minHeight: theme.sizes.touchTargetMin,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radii.xl,
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: theme.spacing.lg,
  },
}));

export default LegalDocumentScreen;
