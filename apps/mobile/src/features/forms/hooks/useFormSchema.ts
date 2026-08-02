import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {i18n} from '@visamesa/content/i18n';

import {fetchFormSchema} from '@/features/forms/services/formSchemaService';
import {FormSchema} from '@/features/forms/types/formTypes';
import {localizeFormSchema} from '@/features/forms/utils/localizeFormSchema';

type UseFormSchemaResult = {
  schema: FormSchema | null;
  isLoading: boolean;
  error: Error | null;
};

export function useFormSchema(formId: string): UseFormSchemaResult {
  const {t, i18n: i18nInstance} = useTranslation('forms');
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const language = i18nInstance.language;

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    fetchFormSchema(formId)
      .then(data => {
        if (!cancelled) {
          setSchema(localizeFormSchema(data, t));
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err
              : new Error(i18n.t('errors.loadSchema', {ns: 'forms'})),
          );
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [formId, language, t]);

  return {schema, isLoading, error};
}
