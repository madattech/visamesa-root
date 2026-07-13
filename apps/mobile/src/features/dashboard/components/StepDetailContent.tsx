import React, {useState} from 'react';
import {Linking, Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Accordion, AccordionItem} from '@/components/Accordion/Accordion';
import {Text} from '@/components/ui/Text';
import {useCollapsingHeaderScroll} from '@/contexts/CollapsingHeaderContext';
import {TieStepDetail} from '@/features/home/types/TieStepDetail';

type StepDetailContentProps = {
  step: TieStepDetail;
};

export function StepDetailContent({step}: StepDetailContentProps) {
  const {styles, theme} = useStyles(stylesheet);
  const {t} = useTranslation('tieSteps');
  const [expandedId, setExpandedId] = useState<string | null>('why');
  const collapsingHeaderScroll = useCollapsingHeaderScroll();

  const handleExpand = (layoutY: number) => {
    if (collapsingHeaderScroll) {
      collapsingHeaderScroll.scrollToY(layoutY - 20);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="bodyLarge" color="onSurfaceVariant">
        {step.description}
      </Text>

      <Accordion
        expandedId={expandedId}
        onExpandedChange={setExpandedId}
        onExpand={handleExpand}>
        <AccordionItem
          id="why"
          title={t('accordion.whyNeeded')}
          expanded={expandedId === 'why'}
          onToggle={() => {}}>
          <Text variant="bodyMedium" color="onSurfaceVariant">
            {step.whyItExists}
          </Text>
        </AccordionItem>

        <AccordionItem
          id="estimated-time"
          title={t('accordion.estimatedTime')}
          expanded={expandedId === 'estimated-time'}
          onToggle={() => {}}>
          <View style={styles.list}>
            {step.estimatedTime.map(item => (
              <View key={item.label} style={styles.listItem}>
                <Text variant="labelLarge">{item.label}</Text>
                <Text variant="bodyMedium" color="onSurfaceVariant">
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </AccordionItem>

        <AccordionItem
          id="requirements"
          title={t('accordion.requirements')}
          expanded={expandedId === 'requirements'}
          onToggle={() => {}}>
          <View style={styles.list}>
            {step.requirements.map(requirement => (
              <View key={requirement.key} style={styles.listItem}>
                <Text variant="bodyMedium">{requirement.label}</Text>
                {requirement.description ? (
                  <Text variant="bodySmall" color="onSurfaceVariant">
                    {requirement.description}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        </AccordionItem>

        <AccordionItem
          id="official-links"
          title={t('accordion.officialLinks')}
          expanded={expandedId === 'official-links'}
          onToggle={() => {}}>
          <View style={styles.list}>
            {step.officialLinks.map(link => (
              <Pressable
                key={link.url}
                accessibilityRole="link"
                accessibilityLabel={link.label}
                android_ripple={{color: theme.colors.primaryContainer}}
                onPress={() => Linking.openURL(link.url)}
                style={({pressed}) => [
                  styles.linkRow,
                  pressed && styles.linkRowPressed,
                ]}>
                <Text variant="bodyMedium" color="primary">
                  {link.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </AccordionItem>

        <AccordionItem
          id="common-questions"
          title={t('accordion.commonQuestions')}
          expanded={expandedId === 'common-questions'}
          onToggle={() => {}}>
          <View style={styles.list}>
            {step.commonQuestions.map(item => (
              <View key={item.question} style={styles.listItem}>
                <Text variant="labelLarge">{item.question}</Text>
                <Text variant="bodyMedium" color="onSurfaceVariant">
                  {item.answer}
                </Text>
              </View>
            ))}
          </View>
        </AccordionItem>
      </Accordion>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    gap: theme.spacing.md,
  },
  list: {
    gap: theme.spacing.sm,
  },
  listItem: {
    gap: theme.spacing.xs / 2,
  },
  linkRow: {
    minHeight: theme.sizes.touchTargetMin,
    justifyContent: 'center',
    paddingVertical: theme.spacing.xs,
  },
  linkRowPressed: {
    opacity: 0.88,
  },
}));
