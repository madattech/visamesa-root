import React, {useState} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Accordion, AccordionItem} from '@/components/Accordion/Accordion';
import {Text} from '@/components/ui/Text';
import type {CommonQuestion} from '@/features/home/types/TieStepDetail';

type FAQSectionProps = {
  faqs: CommonQuestion[];
};

export function FAQSection({faqs}: FAQSectionProps) {
  const {styles} = useStyles(stylesheet);
  const {t} = useTranslation('support');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (faqs.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        {t('faqSectionTitle')}
      </Text>
      <Accordion expandedId={expandedId} onExpandedChange={setExpandedId}>
        {faqs.map((faq, index) => (
          <AccordionItem
            key={`faq-${index}`}
            id={`faq-${index}`}
            title={faq.question}
            expanded={expandedId === `faq-${index}`}
            onToggle={() =>
              setExpandedId(prev =>
                prev === `faq-${index}` ? null : `faq-${index}`,
              )
            }>
            <Text variant="bodyMedium" color="onSurfaceVariant">
              {faq.answer}
            </Text>
          </AccordionItem>
        ))}
      </Accordion>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    gap: theme.spacing.md,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
}));
