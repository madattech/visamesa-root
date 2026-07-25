import {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  buildProcessOverview,
  createProcessOverviewTranslator,
  type ProcessOverviewBadgeLabels,
  type ProcessOverviewContent,
  type ProcessOverviewPhaseContent,
  type ProcessOverviewTabKey,
} from '@visamesa/content/processOverview';
import {i18n} from '@visamesa/content/i18n';

export type ProcessOverviewPhaseView = ProcessOverviewPhaseContent & {
  tabHint?: string;
};

export type UseProcessOverviewResult = {
  screenTitle: string;
  intro: string;
  phases: ProcessOverviewPhaseView[];
  badgeLabels: ProcessOverviewBadgeLabels;
};

function formatTabHint(template: string, tabLabel: string): string {
  return template.replace(/\{\{tab\}\}/g, tabLabel);
}

function resolvePhases(
  content: ProcessOverviewContent,
  getTabLabel: (tab: ProcessOverviewTabKey) => string,
): ProcessOverviewPhaseView[] {
  return content.phases.map(phase => ({
    ...phase,
    tabHint: phase.tab
      ? formatTabHint(content.tabHint, getTabLabel(phase.tab))
      : undefined,
  }));
}

export function useProcessOverview(): UseProcessOverviewResult {
  const {t: tCommon} = useTranslation('common');
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    const handleLanguageChanged = (nextLanguage: string) => {
      setLanguage(nextLanguage);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  return useMemo(() => {
    const content = buildProcessOverview(createProcessOverviewTranslator(i18n));
    const getTabLabel = (tab: ProcessOverviewTabKey) =>
      tCommon(`tabs.${tab}`);

    return {
      screenTitle: content.screenTitle,
      intro: content.intro,
      badgeLabels: content.badges,
      phases: resolvePhases(content, getTabLabel),
    };
  }, [language, tCommon]);
}
