const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;

async function fillPdfForm() {
  const existingPdfBytes = await fs.readFile('./data/firstForm.pdf')
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();
  
  const nameField = form.getTextField('name');
  const emailField = form.getTextField('email');
  const checkbox = form.getCheckBox('consent');
  
  nameField.setText('John Doe');
  emailField.setText('johndoe@example.com');
  checkbox.check();

  const filledPdfBytes = await pdfDoc.save();
  await fs.writeFile('filled_form.pdf', filledPdfBytes);
  
  console.log('PDF form filled successfully!');
}

fillPdfForm().catch(console.error);
