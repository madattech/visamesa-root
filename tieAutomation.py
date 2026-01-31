from PyPDFForm import PdfWrapper
import json
# print(json.dumps(PdfWrapper('./tie-application.pdf').schema, indent=2))

with open('input.json', 'r') as f:
    rawInput = json.load(f)

with open('ex17schema.json', 'r') as f:
    ex17schema = json.load(f)

def fillex17Form(details):
    filled = PdfWrapper('./tie-application.pdf').fill(details)
    filled.write("tiefilled.pdf")


def generateInputObject(ex17schema, inputdetails):

    object = {}
    object[ex17schema['pasaporte']] = inputdetails['personalDetails']['passportNumber']
    object[ex17schema['Nombre']] = inputdetails['personalDetails']['firstName']
    object[ex17schema['1er Appellido']] = inputdetails['personalDetails']['lastName']
    object[ex17schema['2o Apellido']] = inputdetails['personalDetails']['secondLastName']
    object[ex17schema['Lugar']] = inputdetails['personalDetails']['placeOfBirth']
    object[ex17schema['Pais']] = inputdetails['personalDetails']['country']
    object[ex17schema['Nacionalidad']] = inputdetails['personalDetails']['nationality']
    object[ex17schema['nombre del padre']] = inputdetails['personalDetails']['fatherFullName']
    object[ex17schema['nombre de la madre']] = inputdetails['personalDetails']['motherFullName']
    object[ex17schema['Domicilio en España']] = inputdetails['contactDetails']['street']
    object[ex17schema['N']] = inputdetails['contactDetails']['floor']
    object[ex17schema['Piso']] = inputdetails['contactDetails']['door']
    object[ex17schema['Localidad']] = inputdetails['contactDetails']['city']
    object[ex17schema['C.P']] = inputdetails['contactDetails']['zip']
    object[ex17schema['Provincia']] = inputdetails['contactDetails']['province']
    object[ex17schema['Telefono movil']] = inputdetails['contactDetails']['mobile']
    object[ex17schema['E-mail']] = inputdetails['contactDetails']['email']
    return object

details = generateInputObject(ex17schema,rawInput)

print(json.dumps(details))

fillex17Form(details)
