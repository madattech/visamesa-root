import {NativeModules, Platform, Share} from 'react-native';
import {fromByteArray, toByteArray} from 'react-native-quick-base64';
import {
  PDFCheckBox,
  PDFDocument,
  PDFDropdown,
  PDFOptionList,
  PDFRadioGroup,
  PDFTextField,
} from 'pdf-lib';

import {EX17_TIE_BLANK_SEMANTIC_PDF_BASE64} from '@/features/pdfGeneration/forms/ex17/assets/ex17TieBlankSemanticPdfBase64';

import curatedSchema from './schemas/ex17-tie.curated.schema.json';

export type Ex17PdfData = Record<string, unknown>;

type Ex17SchemaField = {
  semanticId: string;
  source?: string | null;
  checkedWhen?: string | boolean | null;
};

type Ex17Schema = {
  fields: Ex17SchemaField[];
};

export type GeneratedPdfFile = {
  fileName: string;
  path: string;
  uri: string;
};

type ReactNativeFsModule = typeof import('react-native-fs');

function getFileSystemModule(): ReactNativeFsModule {
  try {
    // Keep this lazy so iOS builds with stale pods do not crash at module load.
    // If RNFS is not linked, the user gets a recoverable setup error on action.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('react-native-fs') as ReactNativeFsModule;
  } catch (error) {
    throw new Error(
      'PDF file storage is not available. Rebuild the app after running iOS pod install.',
    );
  }
}

function getPathValue(data: Ex17PdfData, source?: string | null): unknown {
  if (!source) {
    return undefined;
  }

  return source.split('.').reduce<unknown>((current, key) => {
    if (current == null || typeof current !== 'object') {
      return undefined;
    }

    return (current as Record<string, unknown>)[key];
  }, data);
}

function splitIsoDate(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }

  return {
    year: match[1],
    month: match[2],
    day: match[3],
  };
}

function resolveValue(data: Ex17PdfData, source?: string | null) {
  const directValue = getPathValue(data, source);
  if (directValue !== undefined) {
    return directValue;
  }

  if (source?.startsWith('applicant.birthDate.')) {
    const date = splitIsoDate(getPathValue(data, 'applicant.birthDate'));
    const parts = source.split('.');
    return date?.[parts[parts.length - 1] as 'day' | 'month' | 'year'];
  }

  if (
    source?.startsWith('signature.') &&
    ['signature.day', 'signature.month', 'signature.year'].includes(source)
  ) {
    const date = splitIsoDate(getPathValue(data, 'signature.date'));
    const parts = source.split('.');
    return date?.[parts[parts.length - 1] as 'day' | 'month' | 'year'];
  }

  return undefined;
}

function valueAsText(value: unknown) {
  if (value === undefined || value === null) {
    return '';
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value);
  }

  return '';
}

function shouldCheckField(
  value: unknown,
  checkedWhen?: string | boolean | null,
) {
  if (typeof checkedWhen === 'boolean') {
    return value === checkedWhen;
  }

  return (
    valueAsText(value).toLowerCase() === valueAsText(checkedWhen).toLowerCase()
  );
}

function fillField(
  field:
    | PDFTextField
    | PDFCheckBox
    | PDFRadioGroup
    | PDFDropdown
    | PDFOptionList,
  schemaField: Ex17SchemaField,
  data: Ex17PdfData,
) {
  const value = resolveValue(data, schemaField.source);

  if (field instanceof PDFTextField) {
    field.setText(valueAsText(value));
    return;
  }

  if (field instanceof PDFCheckBox) {
    if (shouldCheckField(value, schemaField.checkedWhen)) {
      field.check();
    } else {
      field.uncheck();
    }
    return;
  }

  if (field instanceof PDFRadioGroup) {
    if (value !== undefined && value !== null && value !== '') {
      field.select(valueAsText(value));
    }
    return;
  }

  if (field instanceof PDFDropdown || field instanceof PDFOptionList) {
    if (value !== undefined && value !== null && value !== '') {
      field.select(valueAsText(value));
    }
  }
}

export async function generateEx17PdfBytes(data: Ex17PdfData) {
  const templateBytes = toByteArray(EX17_TIE_BLANK_SEMANTIC_PDF_BASE64, true);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();
  const schema = curatedSchema as Ex17Schema;

  for (const schemaField of schema.fields) {
    const field = form.getField(schemaField.semanticId);
    fillField(field as Parameters<typeof fillField>[0], schemaField, data);
  }

  form.updateFieldAppearances();
  return pdfDoc.save();
}

export async function saveEx17Pdf(
  data: Ex17PdfData,
): Promise<GeneratedPdfFile> {
  const bytes = await generateEx17PdfBytes(data);
  const base64 = fromByteArray(bytes);
  const RNFS = getFileSystemModule();
  const fileName = `ex17-tie-${Date.now()}.pdf`;
  const directory =
    Platform.OS === 'android'
      ? RNFS.DownloadDirectoryPath
      : RNFS.DocumentDirectoryPath;
  const path = `${directory}/${fileName}`;

  await RNFS.writeFile(path, base64, 'base64');

  return {
    fileName,
    path,
    uri: `file://${path}`,
  };
}

type PdfViewerNativeModule = {
  openPdf: (pathOrUri: string) => Promise<void>;
};

function getPdfViewerModule(): PdfViewerNativeModule | undefined {
  return NativeModules.PdfViewer as PdfViewerNativeModule | undefined;
}

export async function openGeneratedPdf(file: GeneratedPdfFile) {
  if (Platform.OS === 'android') {
    await getFileSystemModule().scanFile(file.path).catch(() => undefined);
  }

  const pdfViewer = getPdfViewerModule();

  if (!pdfViewer) {
    throw new Error('PDF viewer module is not available');
  }

  await pdfViewer.openPdf(file.path);
}

export async function shareGeneratedPdf(file: GeneratedPdfFile) {
  await Share.share({
    title: file.fileName,
    message: file.fileName,
    url: file.uri,
  });
}
