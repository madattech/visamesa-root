import {useEffect, useRef, useState} from 'react';
import {i18n} from '@visamesa/content/i18n';

import {fetchTieSteps} from '@/features/home/services/tieStepsService';
import {TieStepDetail} from '@/features/home/types/TieStepDetail';

type UseTieStepsResult = {
  steps: TieStepDetail[];
  isLoading: boolean;
  error: Error | null;
};

export function useTieSteps(): UseTieStepsResult {
  const [language, setLanguage] = useState(i18n.language);
  const [steps, setSteps] = useState<TieStepDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const handleLanguageChanged = (nextLanguage: string) => {
      setLanguage(nextLanguage);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (isInitialLoad.current) {
      setIsLoading(true);
      isInitialLoad.current = false;
    }

    fetchTieSteps()
      .then(data => {
        if (!cancelled) {
          setSteps(data);
          setIsLoading(false);
          setError(null);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load steps'));
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [language]);

  return {steps, isLoading, error};
}
