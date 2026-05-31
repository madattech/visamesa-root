# PDF form schemas

Schemas in this directory are generated from fillable PDF AcroForm fields using `pdf-lib`.

## Generate a schema

```sh
npm run pdf:schema -- <pdf-file-or-url> <output-json>
```

Example used for `ex17-tie.schema.json`:

```sh
npm run pdf:schema -- \
  'https://www.inclusion.gob.es/documents/410169/2156469/17-Formulario_TIE.pdf' \
  pdf-generation/schemas/ex17-tie.schema.json
```

## EX-17 note

The user-provided EX-17 document URL with `?download=true` currently downloads a 3-page PDF with **0 AcroForm fields**, so `pdf-lib` cannot fill it through `pdfDoc.getForm()`.

A fillable EX-17 PDF from the same government domain was found at:

```txt
https://www.inclusion.gob.es/documents/410169/2156469/17-Formulario_TIE.pdf
```

That source exposes 70 AcroForm fields and was used to generate `ex17-tie.schema.json`.

## Curated mapping

`ex17-tie.curated.schema.json` maps the misleading PDF field names to semantic labels and app data paths by comparing each AcroForm widget position with the visible EX-17 labels.

Important: field names such as `Textfield-1`, `x`, `CP`, `H`, `M`, etc. are not reliable semantic labels. Use `label`, `semanticId`, `source`, and `checkedWhen` from the curated schema when filling user data. The mapping should still be verified by generating a filled sample PDF and visually reviewing it.

## Generate a blank PDF with semantic field names

```sh
npm run pdf:blank
```

This creates:

```txt
pdf-generation/templates/ex17-tie.blank.semantic.pdf
```

The generated PDF keeps the original EX-17 visual layout, clears field values, renames each AcroForm field to the curated `semanticId`, sets `/TU` to the human-readable `label`, and sets `/TM` to the semantic mapping name. This makes later filling code use stable names like `applicant.passportNumber` instead of misleading names like `Textfield-1`.

## Fill a sample EX-17 PDF

```sh
npm run pdf:fill:ex17
```

Default inputs:

```txt
pdf-generation/config/ex17-dummy-user.json
pdf-generation/templates/ex17-tie.blank.semantic.pdf
pdf-generation/schemas/ex17-tie.curated.schema.json
```

Default output:

```txt
pdf-generation/output/ex17-tie.filled.sample.pdf
```

The fill script keeps the PDF editable for visual verification. It supports ISO dates (`YYYY-MM-DD`) for `applicant.birthDate` and `signature.date`, then splits them into the visible day/month/year fields.
