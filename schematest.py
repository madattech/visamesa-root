from PyPDFForm import PdfWrapper
import json
print(json.dumps(PdfWrapper('./tie-application.pdf').schema, indent=2))
with open('input.json', 'r') as f:
    rawInput = json.load(f)
