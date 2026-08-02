import React from 'react';
import {Linking, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';

import {Text} from '@/components/ui/Text';
import {openWebsiteUrl} from '@/utils/openWebsiteUrl';
import type {LegalBlock} from '@visamesa/content/legalBlocks';

type LegalDocumentBlocksProps = {
  blocks: LegalBlock[];
  onPrivacyLinkPress?: () => void;
};

function RichText({text}: {text: string}) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <Text variant="bodyMedium" color="onSurfaceVariant">
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <Text
              key={index}
              variant="bodyMedium"
              color="onSurfaceVariant"
              style={{fontWeight: '700'}}>
              {part.slice(2, -2)}
            </Text>
          );
        }

        return part;
      })}
    </Text>
  );
}

export function LegalDocumentBlocks({
  blocks,
  onPrivacyLinkPress,
}: LegalDocumentBlocksProps) {
  const {styles} = useStyles(stylesheet);
  const {t} = useTranslation('common');

  return (
    <View style={styles.container}>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        switch (block.type) {
          case 'h2':
            return (
              <Text key={key} variant="titleMedium" style={styles.heading}>
                {block.text}
              </Text>
            );
          case 'h3':
            return (
              <Text key={key} variant="titleSmall" style={styles.subheading}>
                {block.text}
              </Text>
            );
          case 'p':
            return <RichText key={key} text={block.text} />;
          case 'ul':
            return (
              <View key={key} style={styles.list}>
                {block.items.map(item => (
                    <View key={item} style={styles.listItem}>
                    <Text variant="bodyMedium" color="onSurfaceVariant">
                      {'• '}
                    </Text>
                    <View style={styles.listItemText}>
                      <RichText text={item} />
                    </View>
                  </View>
                ))}
              </View>
            );
          case 'pLink':
            return (
              <Text key={key} variant="bodyMedium" color="onSurfaceVariant">
                {block.before ? `${block.before} ` : ''}
                <Text
                  variant="bodyMedium"
                  color="primary"
                  style={styles.link}
                  onPress={() => {
                    openWebsiteUrl(block.linkHref).catch(() => {});
                  }}>
                  {block.linkText}
                </Text>
                {block.after ?? ''}
              </Text>
            );
          case 'privacyLink':
            return (
              <Text key={key} variant="bodyMedium" color="onSurfaceVariant">
                {block.before}{' '}
                <Text
                  variant="bodyMedium"
                  color="primary"
                  style={styles.link}
                  onPress={onPrivacyLinkPress}>
                  {t('footer.privacyPolicy')}
                </Text>
                {block.after}
              </Text>
            );
          case 'email':
            return (
              <Text key={key} variant="bodyMedium" color="onSurfaceVariant">
                <Text variant="labelLarge">{block.label} </Text>
                <Text
                  variant="bodyMedium"
                  color="primary"
                  style={styles.link}
                  onPress={() => {
                    Linking.openURL(`mailto:${block.email}`).catch(() => {});
                  }}>
                  {block.email}
                </Text>
              </Text>
            );
          default:
            return null;
        }
      })}
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    gap: theme.spacing.sm,
  },
  heading: {
    marginTop: theme.spacing.sm,
  },
  subheading: {
    marginTop: theme.spacing.xs,
  },
  list: {
    gap: theme.spacing.xs,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  listItemText: {
    flex: 1,
  },
  link: {
    textDecorationLine: 'underline',
  },
}));
