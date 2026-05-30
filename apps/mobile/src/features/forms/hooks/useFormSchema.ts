import {useEffect, useState} from 'react';

import {fetchFormSchema} from '@/features/forms/services/formSchemaService';
import {FormSchema} from '@/features/forms/types/formTypes';

type UseFormSchemaResult = {
  schema: FormSchema | null;
  isLoading: boolean;
  error: Error | null;
};

export function useFormSchema(formId: string): UseFormSchemaResult {
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    fetchFormSchema(formId)
      .then(data => {
        if (!cancelled) {
          setSchema(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err : new Error('Failed to load form schema'),
          );
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [formId]);

  return {schema, isLoading, error};
}
