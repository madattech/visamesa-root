#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  PDFButton,
  PDFCheckBox,
  PDFDocument,
  PDFDropdown,
  PDFOptionList,
  PDFRadioGroup,
  PDFSignature,
  PDFTextField,
} from 'pdf-lib';

const [, , input, output = 'pdf-generation/schemas/generated-pdf-form-schema.json'] = process.argv;

if (!input) {
  console.error('Usage: node src/scripts/pdf-generation/generate-pdf-form-schema.mjs <pdf-file-or-url> [output-json]');
  process.exit(1);
}

const isUrl = /^https?:\/\//i.test(input);

async function readPdfBytes(source) {
  if (!isUrl) {
    return fs.readFile(source);
  }

  const response = await fetch(source, {
    headers: {
      Accept: 'application/pdf,*/*',
      Referer: new URL(source).origin,
      'User-Agent': 'Mozilla/5.0 PDF schema extractor',
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to download PDF: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('pdf')) {
    throw new Error(`Expected a PDF response, received content-type: ${contentType}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

function getFieldType(field) {
  if (field instanceof PDFTextField) return 'text';
  if (field instanceof PDFCheckBox) return 'checkbox';
  if (field instanceof PDFRadioGroup) return 'radio';
  if (field instanceof PDFDropdown) return 'dropdown';
  if (field instanceof PDFOptionList) return 'optionList';
  if (field instanceof PDFButton) return 'button';
  if (field instanceof PDFSignature) return 'signature';
  return 'unknown';
}

function getOptions(field) {
  if (field instanceof PDFRadioGroup || field instanceof PDFDropdown || field instanceof PDFOptionList) {
    return field.getOptions();
  }
  return [];
}

function getWidgets(field, pages) {
  return field.acroField.getWidgets().map(widget => {
    const rectangle = widget.getRectangle();
    const pageRef = widget.P();
    const pageIndex = pageRef ? pages.findIndex(page => page.ref === pageRef) : -1;

    return {
      page: pageIndex >= 0 ? pageIndex + 1 : null,
      x: Number(rectangle.x.toFixed(2)),
      y: Number(rectangle.y.toFixed(2)),
      width: Number(rectangle.width.toFixed(2)),
      height: Number(rectangle.height.toFixed(2)),
    };
  });
}

function createSchema({ source, pdfDoc, fields }) {
  const pages = pdfDoc.getPages();

  return {
    formId: 'ex17-tie',
    title: 'EX-17 Solicitud de Tarjeta de Identidad de Extranjero',
    source,
    generatedAt: new Date().toISOString(),
    pageCount: pdfDoc.getPageCount(),
    fieldCount: fields.length,
    warning:
      fields.length === 0
        ? 'No AcroForm fields were found. pdf-lib cannot fill this PDF with getForm(). Use a fillable source PDF or a coordinate overlay fallback.'
        : 'Verify every source mapping manually; government PDF field names can be misleading.',
    fields: fields.map((field, index) => ({
      index,
      pdfFieldName: field.getName(),
      type: getFieldType(field),
      options: getOptions(field),
      widgets: getWidgets(field, pages),
      source: null,
      notes: 'TODO verify mapping; PDF field names may be misleading.',
    })),
  };
}

const pdfBytes = await readPdfBytes(input);
const pdfDoc = await PDFDocument.load(pdfBytes);
const fields = pdfDoc.getForm().getFields();
const schema = createSchema({ source: input, pdfDoc, fields });

await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, `${JSON.stringify(schema, null, 2)}\n`);

console.log(`Generated ${schema.fieldCount} fields from ${schema.pageCount} pages -> ${output}`);
if (schema.fieldCount === 0) {
  console.warn(schema.warning);
}
