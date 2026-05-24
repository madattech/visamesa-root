import {useEffect, useState} from 'react';

import {fetchTieSteps} from '@/features/home/services/tieStepsService';
import {TieStepDetail} from '@/features/home/types/TieStepDetail';

type UseTieStepsResult = {
  steps: TieStepDetail[];
  isLoading: boolean;
  error: Error | null;
};

export function useTieSteps(): UseTieStepsResult {
  const [steps, setSteps] = useState<TieStepDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchTieSteps()
      .then(data => {
        if (!cancelled) {
          setSteps(data);
          setIsLoading(false);
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
  }, []);

  return {steps, isLoading, error};
}
