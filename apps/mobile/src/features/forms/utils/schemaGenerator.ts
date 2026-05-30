import {z} from 'zod';

import type {FormSchema} from '../types/formTypes';

type ZodSchemaFields = Record<string, z.ZodTypeAny>;

export const generateZodSchema = (schema: FormSchema) => {
  const schemaFields: ZodSchemaFields = {};

  schema.fields.forEach(field => {
    let finalZodField: z.ZodTypeAny;

    if (field.type === 'phone') {
      const phoneSchema = z.object({
        countryCode: z.string().optional(),
        number: z.string().optional(),
      });

      if (field.required) {
        finalZodField = phoneSchema.refine(
          data => data.number && data.number.length > 0,
          {
            message: `${field.label} is required.`,
          },
        );
      } else {
        finalZodField = phoneSchema.optional();
      }
    } else if (field.type === 'dateRange' || field.type === 'timeRange') {
      const rangeSchema = z.object({
        from: z.string().optional(),
        to: z.string().optional(),
      });

      if (field.required) {
        finalZodField = rangeSchema.refine(data => data.from && data.to, {
          message: `${field.label} is required.`,
        });
      } else {
        finalZodField = rangeSchema.optional();
      }
    } else {
      let zodField = z.string();

      if (field.pattern) {
        zodField = zodField.regex(
          new RegExp(field.pattern),
          'Invalid format. Check the input requirements.',
        );
      }

      if (field.required) {
        finalZodField = zodField.min(1, {
          message: `${field.label} is required.`,
        });
      } else {
        finalZodField = zodField.nullable().or(z.literal('')).optional();
      }
    }

    schemaFields[field.id] = finalZodField;
  });

  return z.object(schemaFields);
};
