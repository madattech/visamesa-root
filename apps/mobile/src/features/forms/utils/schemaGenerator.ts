import {z} from 'zod';

import type {FormField, FormSchema} from '../types/formTypes';
import {isFieldVisible} from './formFieldVisibility';

type ZodSchemaFields = Record<string, z.ZodTypeAny>;

export type FormTranslateFn = (
  key: string,
  options?: Record<string, string>,
) => string;

function buildFieldSchema(
  field: FormField,
  required: boolean,
  translate?: FormTranslateFn,
): z.ZodTypeAny {
  const requiredMessage = (label: string) =>
    translate?.('validation.required', {label}) ?? `${label} is required.`;
  const invalidFormatMessage =
    translate?.('validation.invalidFormat') ??
    'Invalid format. Check the input requirements.';

  if (field.type === 'phone') {
    const phoneSchema = z.object({
      countryCode: z.string().optional(),
      number: z.string().optional(),
    });

    if (!required) {
      return phoneSchema.optional();
    }

    return phoneSchema.refine(
      data => Boolean(data.countryCode?.trim()) && Boolean(data.number?.trim()),
      {
        message: requiredMessage(field.label),
      },
    );
  }

  if (field.type === 'dateRange' || field.type === 'timeRange') {
    const rangeSchema = z.object({
      from: z.string().optional(),
      to: z.string().optional(),
    });

    if (!required) {
      return rangeSchema.optional();
    }

    return rangeSchema.refine(data => Boolean(data.from && data.to), {
      message: requiredMessage(field.label),
    });
  }

  let zodField = z.string();

  if (field.pattern) {
    zodField = zodField.regex(new RegExp(field.pattern), invalidFormatMessage);
  }

  if (!required) {
    return zodField.nullable().or(z.literal('')).optional();
  }

  return zodField.min(1, {
    message: requiredMessage(field.label),
  });
}

function validateRequiredFieldValue(
  field: FormField,
  value: unknown,
  ctx: z.RefinementCtx,
  translate?: FormTranslateFn,
) {
  const result = buildFieldSchema(field, true, translate).safeParse(value);

  if (result.success) {
    return;
  }

  for (const issue of result.error.issues) {
    ctx.addIssue({
      ...issue,
      path: [field.id, ...issue.path],
    });
  }
}

export const generateZodSchema = (
  schema: FormSchema,
  translate?: FormTranslateFn,
) => {
  const schemaFields: ZodSchemaFields = {};

  schema.fields.forEach(field => {
    const requiredAtParseTime = Boolean(field.required && !field.dependsOn);
    schemaFields[field.id] = buildFieldSchema(
      field,
      requiredAtParseTime,
      translate,
    );
  });

  return z.object(schemaFields).superRefine((data, ctx) => {
    schema.fields.forEach(field => {
      if (!field.required || !field.dependsOn) {
        return;
      }

      if (!isFieldVisible(field, data)) {
        return;
      }

      validateRequiredFieldValue(field, data[field.id], ctx, translate);
    });
  });
};
